
import { type LoggerAdapter } from '@ig/utils';
import cors, { type CorsOptions } from 'cors';
import express, { type Application, type NextFunction, type Request, type Response } from 'express';
import { DbClient } from '../db/DbClient';
import { BeLogger } from '../logger/BeLogger';
import type { PackageDb } from '../types/exported/DbTypes';
import type { ExpressAppDbInfoT, ExpressAppStarterInfoT, ExpressPluginContainerT } from '../types/exported/ExpressTypes';

export type ExpressAppSignalHandler = {
  on: (signal: string, fn: (signal: string) => void) => void
  exit: (ret?: number) => void,
}

export class ExpressApp {
  private app: Application;

  constructor(
    private expressAppStarterInfo: ExpressAppStarterInfoT,
    private logger: LoggerAdapter = new BeLogger(),
    private signalHandler: ExpressAppSignalHandler = process,
    private corsMiddleware: (options?: CorsOptions) => (req: Request, res: Response, next: NextFunction) => void = cors,
  ) {
    this.app = express();
  }

  public async startApp(): Promise<void> {
    this.logger.log(`Starting server...`);

    // Middleware to handle CORS
    this.logger.log(`Initializing CORS...`);
    this.initCors();

    // Middleware to parse JSON bodies
    this.app.use(express.json());

    let dbClient: DbClient | null = null;
    if (this.expressAppStarterInfo.dbInfo) {
      this.logger.log(`Initializing db...`);
      dbClient = await this.initDb(
        this.expressAppStarterInfo.dbInfo,
        this.expressAppStarterInfo.expressPluginContainers);
    }

    // init routes
    this.logger.log(`Initializing routes...`);
    await this.initRoutes();

    // post init callbacks
    this.logger.log(`Initializing post-init...`);
    await this.postInit();

    let isShuttingDown = false;
    const shutdown = async (signal: string): Promise<void> => {
      if (isShuttingDown) {
        return;
      }
      isShuttingDown = true;

      if (dbClient) {
        this.logger.log(`Received ${signal} signal. Disconnecting DB client...`);
        await dbClient.dbDisconnet();
      }

      this.logger.log(`Received ${signal} signal. Closing server...`);
      this.signalHandler.exit(0);
    }

    this.signalHandler.on('SIGINT', shutdown);
    this.signalHandler.on('SIGTERM', shutdown);

    // Start the server
    this.app.listen(this.expressAppStarterInfo.listerPort, () => {
      this.logger.log(`Server is running at http://localhost:${this.expressAppStarterInfo.listerPort}`);
    });
  }

  private initCors(): void {
    if (this.expressAppStarterInfo.corsAllowOrigins !== undefined) {
      for (const corsAllowOrigin of this.expressAppStarterInfo.corsAllowOrigins) {
        this.logger.log(`Initializing CORS for [${corsAllowOrigin}]...`);

        this.app.use(this.corsMiddleware({
          origin: corsAllowOrigin,
          credentials: true, // for cookies/auth
        }));
      }
    }
  }

  private async initDb(
    dbInfo: ExpressAppDbInfoT,
    expressPluginContainers: ExpressPluginContainerT<unknown>[],
  ): Promise<DbClient> {
    const dbClient = new DbClient(dbInfo);
    await dbClient.dbConnect();

    // here need to connect to db

    for (const expressPluginContainer of expressPluginContainers) {
      if (expressPluginContainer.getPackageDb !== undefined) {
        const packageDb: PackageDb = expressPluginContainer.getPackageDb();
        await packageDb.createTables(true, dbInfo.tableNamePrefix);
      }
    }

    return dbClient;
  }

  private async initRoutes(): Promise<void> {
    for (const expressPluginContainer of this.expressAppStarterInfo.expressPluginContainers) {
      if (expressPluginContainer.routeConfig !== undefined) {
        const router = await expressPluginContainer.routeConfig.expressPlugin
          .initRouter(this.expressAppStarterInfo.appInfo, expressPluginContainer.routeConfig.pluginConfig);

        this.app.use(expressPluginContainer.routeConfig.route, router);
      }
    }
  }

  private async postInit(): Promise<void> {
    for (const expressPluginContainer of this.expressAppStarterInfo.expressPluginContainers) {
      if (expressPluginContainer.postInitCb !== undefined) {
        await expressPluginContainer.postInitCb(expressPluginContainer.routeConfig?.pluginConfig);
      }
    }
  }
}

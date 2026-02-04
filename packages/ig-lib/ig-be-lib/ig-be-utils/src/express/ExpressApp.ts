
import type { LoggerAdapter } from '@ig/utils';
import cors, { type CorsOptions } from 'cors';
import express, { type Application, type NextFunction, type Request, type Response } from 'express';
import { DbInstance } from '../db/DbInstance';
import { BeLogger } from '../logger/BeLogger';
import type { PackageDb } from '../types/exported/DbTypes';
import type { ExpressAppDbInfoT, ExpressAppStarterInfoT, ExpressPluginContainerT } from '../types/exported/ExpressTypes';

export class ExpressApp {
  private app: Application;

  constructor(
    private expressAppStarterInfo: ExpressAppStarterInfoT,
    private logger: LoggerAdapter = new BeLogger(),
    private signalHandler: { on: (signal: string, fn: (signal: string) => void) => void } = process,
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

    let dbInstance: DbInstance | null = null;
    if (this.expressAppStarterInfo.dbInfo) {
      this.logger.log(`Initializing db...`);
      dbInstance = await this.initDb(
        this.expressAppStarterInfo.dbInfo,
        this.expressAppStarterInfo.expressPluginContainers);
    }

    // init routes
    this.logger.log(`Initializing routes...`);
    await this.initRoutes();

    // post init callbacks
    this.logger.log(`Initializing post-init...`);
    await this.postInit();

    const shutdown = async (signal: string): Promise<void> => {
      this.logger.log(`Received ${signal} signal. Closing server...`);
      if (dbInstance) {
        await dbInstance.stopDb();
      }
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
  ): Promise<DbInstance> {
    const dbInstance = new DbInstance(dbInfo);
    await dbInstance.startDb();

    // here need to connect to db

    for (const expressPluginContainer of expressPluginContainers) {
      if (expressPluginContainer.getDbAdapterCb) {
        const packageDb: PackageDb = expressPluginContainer.getDbAdapterCb();
        await packageDb.createTables(true, dbInfo.tableNamePrefix);
      }
    }

    return dbInstance;
  }

  private async initRoutes(): Promise<void> {
    for (const expressPluginContainer of this.expressAppStarterInfo.expressPluginContainers) {
      const dbAdapter = expressPluginContainer.getDbAdapterCb ? expressPluginContainer.getDbAdapterCb() : null;

      const router = await expressPluginContainer.expressPlugin
        .initRouter(this.expressAppStarterInfo.appInfo, dbAdapter, expressPluginContainer.pluginConfig);

      this.app.use(expressPluginContainer.route, router);
    }
  }

  private async postInit(): Promise<void> {
    for (const expressPluginContainer of this.expressAppStarterInfo.expressPluginContainers) {
      if (expressPluginContainer.postInitCb) {
        const dbAdapter = expressPluginContainer.getDbAdapterCb ? expressPluginContainer.getDbAdapterCb() : null;
        await expressPluginContainer.postInitCb(dbAdapter);
      }
    }
  }
}

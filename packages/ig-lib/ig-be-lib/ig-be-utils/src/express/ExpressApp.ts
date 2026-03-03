
import { type LoggerAdapter } from '@ig/utils';
import cookieParser from 'cookie-parser';
import cors, { type CorsOptions } from 'cors';
import express, { type Application, type NextFunction, type Request, type Response } from 'express';
import { DbClient } from '../db/DbClient';
import { BeLogger } from '../logger/BeLogger';
import type { PackageDb } from '../types/exported/DbTypes';
import type {
  ExpressAppDbInfoT,
  ExpressAppStarterInfoT, ExpressPluginContainerT
} from '../types/exported/ExpressTypes';

export type ExpressAppSignalHandler = {
  on: (signal: string, fn: (signal: string) => void) => void
  exit: (ret?: number) => void,
}

export type ExpressAppHandlersT = {
  signalHandler?: ExpressAppSignalHandler,
  corsMiddleware?: (options?: CorsOptions) => (req: Request, res: Response, next: NextFunction) => void,
  cookieParserMiddleware?: () => (req: Request, res: Response, next: NextFunction) => void,
  jsonMiddleware?: () => (req: Request, res: Response, next: NextFunction) => void,
}

export class ExpressApp {
  private app: Application;

  constructor(
    private expressAppStarterInfo: ExpressAppStarterInfoT,
    private logger: LoggerAdapter = new BeLogger(),
    private handlers: ExpressAppHandlersT = {
      signalHandler: process,
      corsMiddleware: cors,
      cookieParserMiddleware: cookieParser,
      jsonMiddleware: express.json,
    },
  ) {
    this.app = express();
  }

  public async startApp(): Promise<void> {
    this.logger.info(`Starting server...`);

    // Middleware to handle CORS
    this.logger.info(`Initializing CORS...`);
    this.initCors();

    // Middleware to parse cookies
    if (this.handlers.cookieParserMiddleware) {
      this.app.use(this.handlers.cookieParserMiddleware());
    }

    // Middleware to parse JSON bodies
    if (this.handlers.jsonMiddleware) {
      this.app.use(this.handlers.jsonMiddleware());
    }

    let dbClient: DbClient | null = null;
    if (this.expressAppStarterInfo.dbInfo) {
      this.logger.info(`Initializing db...`);
      dbClient = await this.initDb(
        this.expressAppStarterInfo.dbInfo,
        this.expressAppStarterInfo.expressPluginContainers);
    }

    // init routes
    this.logger.info(`Initializing routes...`);
    await this.initRoutes();

    // post init callbacks
    this.logger.info(`Initializing post-init...`);
    await this.postInit();

    let isShuttingDown = false;
    const createShutdownHandler = (signalHandler: ExpressAppSignalHandler) => async (signal: string): Promise<void> => {
      if (isShuttingDown) {
        return;
      }
      isShuttingDown = true;

      if (dbClient) {
        this.logger.info(`Received ${signal} signal. Disconnecting DB client...`);
        await dbClient.dbDisconnect();
      }

      this.logger.info(`Received ${signal} signal. Closing server...`);
      signalHandler.exit(0);
    }

    if (this.handlers.signalHandler !== undefined) {
      const shutdownHandler = createShutdownHandler(this.handlers.signalHandler);
      this.handlers.signalHandler.on('SIGINT', shutdownHandler);
      this.handlers.signalHandler.on('SIGTERM', shutdownHandler);
    }

    // Start the server
    this.app.listen(this.expressAppStarterInfo.listerPort, () => {
      this.logger.info(`Server is running at http://localhost:${this.expressAppStarterInfo.listerPort}`);
    });
  }

  private initCors(): void {
    if (this.handlers.corsMiddleware != undefined && this.expressAppStarterInfo.corsAllowOrigins !== undefined) {
      for (const corsAllowOrigin of this.expressAppStarterInfo.corsAllowOrigins) {
        this.logger.info(`Initializing CORS for [${corsAllowOrigin}]...`);

        this.app.use(this.handlers.corsMiddleware({
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
          .initRouter(this.expressAppStarterInfo.appInfo, expressPluginContainer.routeConfig.publicPluginConfig);

        this.app.use(expressPluginContainer.routeConfig.route, router);
      }
    }
  }

  private async postInit(): Promise<void> {
    for (const expressPluginContainer of this.expressAppStarterInfo.expressPluginContainers) {
      if (expressPluginContainer.postInitCb !== undefined) {
        await expressPluginContainer.postInitCb(expressPluginContainer.routeConfig?.publicPluginConfig);
      }
    }
  }
}

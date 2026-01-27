
import type { LoggerAdapter } from '@ig/lib';
import express, { type Application } from 'express';
import { DbInstance } from '../db/DbInstance';
import { BeLogger } from '../logger/BeLogger';
import type { ExpressAppStarterInfoT } from '../types/exported/ExpressTypes';

export class ExpressApp {
  private app: Application;

  constructor(
    private expressAppStarterInfo: ExpressAppStarterInfoT,
    private logger: LoggerAdapter = new BeLogger(),
    private signalHandler: { on: (signal: string, fn: (signal: string) => void) => void } = process,
  ) {
    this.app = express();
  }

  public async startApp(): Promise<void> {
    this.logger.log(`Starting server...`);

    await this.initDb();

    // Middleware to parse JSON bodies
    this.app.use(express.json());

    // init routes
    this.initRoutes();

    // Start the server
    this.app.listen(this.expressAppStarterInfo.listerPort, () => {
      this.logger.log(`Server is running at http://localhost:${this.expressAppStarterInfo.listerPort}`);
    });
  }

  private async initDb(): Promise<void> {
    this.logger.log(`Initializing db...`);

    const dbInstance = new DbInstance(this.expressAppStarterInfo.dbInfo);
    await dbInstance.startDb();

    // here need to connect to db

    for (const expressPluginContainer of this.expressAppStarterInfo.expressPluginContainers) {
      await expressPluginContainer.expressPlugin.initDb(this.expressAppStarterInfo.dbInfo);
    }

    const shutdown = async (signal: string): Promise<void> => {
      this.logger.log(`Received ${signal} signal. Closing server...`);
      await dbInstance.stopDb();
    }

    this.signalHandler.on('SIGINT', shutdown);
    this.signalHandler.on('SIGTERM', shutdown);
  }

  private initRoutes(): void {
    this.logger.log(`Initializing routes...`);

    for (const expressPluginContainer of this.expressAppStarterInfo.expressPluginContainers) {
      const router = expressPluginContainer.expressPlugin.initRouter(this.expressAppStarterInfo.appInfo);
      this.app.use(expressPluginContainer.route, router);
    }
  }
}

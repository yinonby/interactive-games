
import type { Router } from 'express';

export type ExpressAppStarterInfoT = {
  listerPort: number,
  appInfo: ExpressAppInfoT,
  dbInfo: ExpressAppDbInfoT,
  expressPluginContainers: {
    route: string,
    expressPlugin: ExpressPluginT,
  }[],
}

export type ExpressAppInfoT = {
  appVersion: string,
}

export type ExpressAppDbInfoT = ({
  dbType: 'mongodb';
  mongoConnString: string;
} | {
  dbType: 'inmem-mongodb';
} | {
  dbType: 'mysql';
  mySqlConnString: string;
}) & {
  tableNamePrefix: string,
}

export interface ExpressPluginT {
  initRouter(appInfo: ExpressAppInfoT): Router;
  initDb: (dbInfo: ExpressAppDbInfoT) => Promise<void>;
}

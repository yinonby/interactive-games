
import type { Router } from 'express';
import type { PackageDb } from './DbTypes';

export type ExpressAppStarterInfoT = {
  appInfo: ExpressAppInfoT,
  corsAllowOrigins?: string[],
  listerPort: number,
  dbInfo?: ExpressAppDbInfoT,
  expressPluginContainers: ExpressPluginContainerT<unknown>[],
}

export type ExpressPluginContainerT<DB_ADP_T> = {
  getDbAdapterCb?: () => PackageDb & DB_ADP_T; // decided by the top level app
  route: string, // decided by the top level app
  expressPlugin: ExpressPluginT<DB_ADP_T>,
  postInitCb?: (dbAdapter: DB_ADP_T | null) => Promise<void>,
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

export interface ExpressPluginT<DB_ADP_T> {
  initRouter(appInfo: ExpressAppInfoT, dbAdapter: DB_ADP_T | null): Promise<Router>;
}

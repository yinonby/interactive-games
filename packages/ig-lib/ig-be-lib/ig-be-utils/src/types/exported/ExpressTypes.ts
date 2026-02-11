
import type { Router } from 'express';
import type { PackageDb } from './DbTypes';

export type ExpressAppStarterInfoT = {
  appInfo: ExpressAppInfoT,
  corsAllowOrigins?: string[],
  listerPort: number,
  dbInfo?: ExpressAppDbInfoT,
  expressPluginContainers: ExpressPluginContainerT<unknown>[],
}

export type ExpressPluginContainerT<PLUGIN_CONFIG_T> = {
  getPackageDb?: () => PackageDb; // decided by the top level app
  routeConfig?: {
    route: string, // decided by the top level app
    expressPlugin: ExpressPluginT<PLUGIN_CONFIG_T>,
    pluginConfig: PLUGIN_CONFIG_T,
  },
  postInitCb?: (pluginConfig: PLUGIN_CONFIG_T) => Promise<void>,
}

export interface ExpressPluginT<PLUGIN_CONFIG_T> {
  initRouter(appInfo: ExpressAppInfoT, pluginConfig: PLUGIN_CONFIG_T): Promise<Router>;
}

export type ExpressAppInfoT = {
  appVersion: string,
}

export type ExpressAppDbInfoT = ({
  dbType: 'mongodb';
  mongoConnString: string;
} | {
  dbType: 'mysql';
  mySqlConnString: string;
}) & {
  tableNamePrefix: string,
}

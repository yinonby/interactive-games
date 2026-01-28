
import type { HttpAdapter } from '@ig/client-utils';
import type { BaseQueryApi } from '@reduxjs/toolkit/query';
import type { AppErrorCodeT } from './AppErrorTypes';

export interface AppRtkHttpAdapterGeneratorProvider {
  generateHttpAdapter: (api: BaseQueryApi, url?: string) => HttpAdapter | null;
}

export type AppRtkErrorT = {
  status: number,
  appErrCode: AppErrorCodeT,
  errMsg?: string
}

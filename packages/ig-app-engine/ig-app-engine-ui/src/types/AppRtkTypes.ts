
import type { BaseQueryApi } from '@reduxjs/toolkit/query';
import type { HttpAdapter } from '../../../../ig-lib/ig-client-lib/ig-client-utils';
import type { AppErrorCodeT } from './AppErrorTypes';

export interface AppRtkHttpAdapterGeneratorProvider {
  generateHttpAdapter: (api: BaseQueryApi, url?: string) => HttpAdapter | null;
}

export type AppRtkErrorT = {
  status: number,
  appErrCode: AppErrorCodeT,
  errMsg?: string
}

export type AppRtkQueryReturnValue<T = unknown, E = unknown> = {
    error: E;
    data?: undefined;
} | {
    error?: undefined;
    data: T;
};

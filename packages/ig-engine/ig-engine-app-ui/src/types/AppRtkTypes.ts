
import type { HttpAdapter } from '@ig/client-utils';
import type { AppApiServerErrorCodeT } from "@ig/engine-models";
import type { BaseQueryApi } from '@reduxjs/toolkit/query';

export interface AppRtkHttpAdapterGeneratorProvider {
  generateHttpAdapter: (api: BaseQueryApi) => HttpAdapter | null;
}

export type AppErrorCodeT = AppApiServerErrorCodeT
  | "appError:networkError"
  | "appError:invalidResponse"
  | "appError:unknown"
;

export type AppRtkErrorT = {
  status: number,
  appErrCode: AppErrorCodeT;
  errMsg?: string,
};

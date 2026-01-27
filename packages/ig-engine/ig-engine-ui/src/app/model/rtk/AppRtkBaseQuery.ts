
import type { HttpAdapter } from '@ig/client-utils/src/types/HttpProvider';
import type { LoggerAdapter } from '@ig/lib';
import type { BaseQueryApi, BaseQueryFn } from '@reduxjs/toolkit/query';
import type { AppRtkErrorT, AppRtkHttpAdapterGeneratorProvider } from '../../../types/AppRtkTypes';
import { extractAppRtkError } from "./AppRtkUtils";

export const createAppRtkBaseQuery = (): BaseQueryFn<
  {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    data?: unknown;
  },
  unknown,
  AppRtkErrorT
> =>
  async ({ url, method, data }, api: BaseQueryApi) => {
    const { appRtkHttpAdapterGeneratorProvider, logger } = api.extra as {
      appRtkHttpAdapterGeneratorProvider: AppRtkHttpAdapterGeneratorProvider,
      logger: LoggerAdapter,
    }
    const httpAdapter: HttpAdapter | null = appRtkHttpAdapterGeneratorProvider.generateHttpAdapter(api);

    try {
      if (httpAdapter === null) {
        // this is a bug
        logger.error("Unexpected error when generating an httpAdapter");
        throw new Error("Unexpected error when generating an httpAdapter");
      }

      const result = await httpAdapter.request({
        url,
        method,
        data,
      });

      return { data: result };
    } catch (error: unknown) {
      logger.warn("An error ocurred in AppRtkBaseQuery", error);

      return {
        error: extractAppRtkError(error),
      };
    }
  };


import type { HttpAdapter } from '@ig/client-utils/src/types/HttpProvider';
import type { LoggerAdapter } from '@ig/lib';
import type { BaseQueryApi, BaseQueryFn } from '@reduxjs/toolkit/query';
import type { AppRtkErrorT, AppRtkHttpAdapterGeneratorProvider } from '../../../types/AppRtkTypes';
import { extractAppRtkError } from "./AppRtkUtils";

export const createAppRtkBaseQuery = (): BaseQueryFn<
  {
    url: string,
    kind?: undefined,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: unknown,
  } | {
    url: string,
    kind: 'graphql',
    graphql: {
      document: string; // GraphQL query string
      variables?: Record<string, string | number | object>;
    };
  },
  unknown,
  AppRtkErrorT
> =>
  async (args, api: BaseQueryApi) => {
    const { url } = args;
    const { appRtkHttpAdapterGeneratorProvider, logger } = api.extra as {
      appRtkHttpAdapterGeneratorProvider: AppRtkHttpAdapterGeneratorProvider,
      logger: LoggerAdapter,
    }
    const httpAdapter: HttpAdapter | null = appRtkHttpAdapterGeneratorProvider.generateHttpAdapter(api, url);

    try {
      if (httpAdapter === null) {
        // this is a bug
        logger.error("Unexpected error when generating an httpAdapter");
        throw new Error("Unexpected error when generating an httpAdapter");
      }

      // --------- GraphQL path ----------
      if (args.kind === 'graphql') {
        const { graphql } = args;
        const { document, variables } = graphql;

        const result = await httpAdapter.request({
          url: url,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apollo-require-preflight': 'true',
          },
          data: { query: document, variables },
        }) as { data: object };
        return { data: result.data }; // GraphQL responses usually have { data, errors }
      }

        // --------- REST path ----------
      const { method, data } = args;
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

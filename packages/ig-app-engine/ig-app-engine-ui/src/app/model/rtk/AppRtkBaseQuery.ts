
import type { LoggerAdapter } from '@ig/utils';
import type { BaseQueryApi, BaseQueryFn } from '@reduxjs/toolkit/query';
import type { HttpAdapter } from '../../../../../../ig-lib/ig-client-lib/ig-client-utils/src/types/HttpProvider';
import type { AppRtkErrorT, AppRtkHttpAdapterGeneratorProvider } from '../../../types/AppRtkTypes';
import { handleDefaultRequest } from './AppRtkDefaultRequestHandler';
import { handleGraphqlRequest } from './AppRtkGraphqlRequestHandler';
import { extractAppRtkError } from './AppRtkUtils';

type AppRtkQueryArgs = {
  url: string,
} & ({
  kind?: undefined,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  data?: unknown,
} | {
  kind: 'graphql',
  graphql: {
    document: string; // GraphQL query string
    variables?: Record<string, string | number | object>;
  };
})

export const createAppRtkBaseQuery = (): BaseQueryFn<
  AppRtkQueryArgs,
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
        return handleGraphqlRequest({
          url,
          graphql: args.graphql,
          httpAdapter,
          logger
        });
      } else {
        return handleDefaultRequest({
          url,
          method: args.method,
          data: args.data,
          httpAdapter,
          logger
        });
      }
    } catch (error: unknown) {
      logger.warn("An error ocurred in AppRtkBaseQuery", error);

      return {
        error: extractAppRtkError(error),
      };
    }
  };

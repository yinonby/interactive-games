
import type { HttpAdapter } from '@ig/client-utils';
import type { LoggerAdapter } from '@ig/utils';
import type { AppRtkErrorT } from '../../../types/AppRtkTypes';
import type { AppRtkQueryReturnValue } from './AppRtkDefs';

export type GraphqlResponseT = {
  data: null | object,
  errors?: { message: string }[]
};

export const handleGraphqlRequest = async (args: {
  url: string,
  graphql: {
    document: string; // GraphQL query string
    variables?: Record<string, string | number | object>;
  },
  httpAdapter: HttpAdapter,
  logger: LoggerAdapter,
}): Promise<AppRtkQueryReturnValue<unknown, AppRtkErrorT>> => {
  const { url, graphql, httpAdapter, logger } = args;
  const { document, variables } = graphql;

  const result = await httpAdapter.request({
    url: url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apollo-require-preflight': 'true',
    },
    data: { query: document, variables },
  }) as GraphqlResponseT;

  if (result.errors !== undefined) {
    logger.warn('Graphql query responded with errors', result.errors);

    return {
      error: {
        status: 500,
        appErrCode: 'appError:unknown',
        errMsg: result.errors.length ? result.errors[0].message : undefined,
      }
    }
  }

  return { data: result.data }; // GraphQL responses usually have { data, errors }
}

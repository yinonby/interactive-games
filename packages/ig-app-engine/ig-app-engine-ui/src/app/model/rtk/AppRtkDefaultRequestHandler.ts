
import type { HttpAdapter } from '@ig/client-utils';
import type { LoggerAdapter } from '@ig/utils';
import type { AppRtkErrorT } from '../../../types/AppRtkTypes';
import type { AppRtkQueryReturnValue } from './AppRtkDefs';
import { extractAppRtkError } from './AppRtkUtils';

export const handleDefaultRequest = async (args: {
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  data: unknown | undefined,
  httpAdapter: HttpAdapter,
  logger: LoggerAdapter,
}): Promise<AppRtkQueryReturnValue<unknown, AppRtkErrorT>> => {
  const { url, method, data, httpAdapter, logger } = args;

  try {
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
}

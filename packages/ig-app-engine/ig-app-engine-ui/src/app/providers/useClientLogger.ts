/* istanbul ignore file */

import type { LoggerAdapter } from '@ig/utils';
import { ConsoleLogger } from '../../../../../ig-lib/ig-client-lib/ig-client-utils';

export const useClientLogger = (): LoggerAdapter => {
  return new ConsoleLogger();
};

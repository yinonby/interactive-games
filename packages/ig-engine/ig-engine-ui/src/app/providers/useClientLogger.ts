/* istanbul ignore file */

import { ConsoleLogger } from "@ig/client-utils";
import type { LoggerAdapter } from "@ig/lib";

export const useClientLogger = (): LoggerAdapter => {
  return new ConsoleLogger();
};

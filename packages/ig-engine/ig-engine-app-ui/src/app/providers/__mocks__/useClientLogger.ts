
import { ConsoleLogger } from "@ig/client-utils";
import type { LoggerAdapter } from "@ig/lib";

let isExpectingTestingError = false;
export const startExpectingTestingErrors = () => isExpectingTestingError = true;
export const stopExpectingTestingErrors = () => isExpectingTestingError = false;

export const useClientLogger = (): LoggerAdapter => {
  return new ConsoleLogger(!isExpectingTestingError);
};

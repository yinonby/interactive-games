/* istanbul ignore file */

import { Axios, type HttpAdapter } from "@ig/client-utils";
import { ApiServerMock } from "../../../test/mocks/ApiServerMock";

export function useHttpProvider(apiUrl: string, isDevel: boolean): HttpAdapter {
  if (isDevel) {
    return new ApiServerMock(apiUrl);
  }
  return new Axios(apiUrl);
}

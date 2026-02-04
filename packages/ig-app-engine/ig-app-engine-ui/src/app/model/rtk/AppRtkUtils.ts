
import type { ApiServerErrorCodeT, AppErrorCodeT } from '../../../types/AppErrorTypes';
import { AppRtkErrorT } from '../../../types/AppRtkTypes';

export const extractAppRtkError = (error: unknown): AppRtkErrorT => {
  let status = 500;
  let appErrCode: AppErrorCodeT = "appError:unknown";
  let errMsg: string | undefined = undefined;

  if (typeof error === "object" && error !== null) {
    if ("status" in error && typeof error.status === "number") {
      status = error.status;
    }

    if ("apiServerErrCode" in error && typeof error.apiServerErrCode === "string") {
      appErrCode = error.apiServerErrCode as ApiServerErrorCodeT;
    }

    if ("message" in error && typeof error.message === "string") {
      errMsg = error.message;
    }
  }

  return {
    status: status,
    appErrCode: appErrCode,
    errMsg: errMsg
  };
}

function hasAppErrCode(error: unknown): error is { appErrCode: AppErrorCodeT } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'appErrCode' in error &&
    typeof error.appErrCode === 'string'
  );
}

export function extractAppErrorCodeFromUnknownObject(error: unknown): AppErrorCodeT {
  if (hasAppErrCode(error)) {
    return error.appErrCode;
  }
  return "appError:unknown";
}

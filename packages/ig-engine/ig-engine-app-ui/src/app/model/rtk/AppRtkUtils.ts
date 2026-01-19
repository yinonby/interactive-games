
import type { AppApiServerErrorCodeT } from "@ig/engine-models";
import type { SerializedError } from "@reduxjs/toolkit";
import type { AppErrorCodeT, AppRtkErrorT } from "../../../types/AppRtkTypes";

export const extractAppRtkError = (error: unknown): AppRtkErrorT => {
  let status = 500;
  let appErrCode: AppErrorCodeT = "appError:unknown";
  let errMsg: string | undefined = undefined;

  if (typeof error === "object" && error !== null) {
    if ("status" in error && typeof error.status === "number") {
      status = error.status;
    }

    if ("apiErrCode" in error && typeof error.apiErrCode === "string" && error.apiErrCode.startsWith("apiError:")) {
      appErrCode = error.apiErrCode as AppApiServerErrorCodeT;
    }

    if ("message" in error && typeof error.message === "string") {
      errMsg = error.message;
    }
  }

  return {
    status: status,
    appErrCode: appErrCode,
    errMsg: errMsg,
  }
}

export function extractAppErrorCodeFromAppRtkError(error: AppRtkErrorT | SerializedError): AppErrorCodeT {
  if (typeof error === "object" && error !== null && "appErrCode" in error) {
    return error.appErrCode;
  }
  return "appError:unknown";
}

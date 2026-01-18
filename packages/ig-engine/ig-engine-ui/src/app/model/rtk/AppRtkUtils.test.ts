
import type { SerializedError } from "@reduxjs/toolkit";
import type { AppRtkErrorT } from "../../../types/AppRtkTypes";
import { extractAppErrorCodeFromAppRtkError, extractAppRtkError } from "./AppRtkUtils";

describe("AppRtkUtils", () => {
  describe("extractAppRtkError", () => {
    it("extracts status, apiErrCode (when starts with 'apiError:') and message", () => {
      const input = {
        status: 404,
        apiErrCode: "apiError:not_found",
        message: "Not found",
      } as unknown;
      const res = extractAppRtkError(input);
      expect(res).toEqual({
        status: 404,
        appErrCode: "apiError:not_found",
        errMsg: "Not found",
      });
    });

    it("falls back to default appErrCode when apiErrCode does not start with 'apiError:'", () => {
      const input = {
        status: 400,
        apiErrCode: "invalid_code",
        message: "Bad request",
      } as unknown;
      const res = extractAppRtkError(input);
      expect(res).toEqual({
        status: 400,
        appErrCode: "appError:unknown",
        errMsg: "Bad request",
      });
    });

    it("returns no message when message is not a string", () => {
      const input = {
        status: 400,
        apiErrCode: "apiError:server",
        message: 32,
      } as unknown;
      const res = extractAppRtkError(input);
      expect(res).toEqual({
        status: 400,
        appErrCode: "apiError:server",
        errMsg: undefined,
      });
    });

    it("returns defaults for non-object errors (e.g., string)", () => {
      const input = "some error string" as unknown;
      const res = extractAppRtkError(input);
      expect(res).toEqual({
        status: 500,
        appErrCode: "appError:unknown",
        errMsg: undefined,
      });
    });
  });

  describe("extractAppErrorCodeFromAppRtkError", () => {
    it("returns appErrCode when present on the object", () => {
      const input = { appErrCode: "apiError:auth" } as unknown;
      const code = extractAppErrorCodeFromAppRtkError(input as AppRtkErrorT);
      expect(code).toBe("apiError:auth");
    });

    it("returns default when appErrCode is not present (e.g., SerializedError shape)", () => {
      const serializedLike = { message: "oops", name: "Error" } as unknown;
      const code = extractAppErrorCodeFromAppRtkError(serializedLike as SerializedError);
      expect(code).toBe("appError:unknown");
    });
  });
});
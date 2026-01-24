
import { extractAppErrorCodeFromUnknownObject, extractAppRtkError } from "./AppRtkUtils";

describe("AppRtkUtils", () => {
  describe("extractAppRtkError", () => {
    it("extracts status, apiErrCode (when starts with 'apiError:') and message", () => {
      const error = {
        status: 404,
        apiServerErrCode: "apiError:not_found",
        message: "Not found",
      } as unknown;
      const res = extractAppRtkError(error);
      expect(res).toEqual({
        status: 404,
        appErrCode: "apiError:not_found",
        errMsg: "Not found",
      });
    });

    it("returns no message when message is not a string", () => {
      const error = {
        status: 400,
        apiServerErrCode: "apiError:server",
        message: 32,
      } as unknown;
      const res = extractAppRtkError(error);
      expect(res).toEqual({
        status: 400,
        appErrCode: "apiError:server",
        errMsg: undefined,
      });
    });

    it("returns defaults for non-object errors (e.g., string)", () => {
      const error = "some error string" as unknown;
      const res = extractAppRtkError(error);
      expect(res).toEqual({
        status: 500,
        appErrCode: "appError:unknown",
        errMsg: undefined,
      });
    });
  });

  describe("extractAppErrorCodeFromUnknownObject", () => {
    it("returns appErrCode when present on the object", () => {
      const error = { appErrCode: "apiError:auth" } as unknown;
      const code = extractAppErrorCodeFromUnknownObject(error);
      expect(code).toBe("apiError:auth");
    });

    it("returns default when appErrCode is not present (e.g., SerializedError shape)", () => {
      const serializedLike = { message: "oops", name: "Error" } as unknown;
      const code = extractAppErrorCodeFromUnknownObject(serializedLike);
      expect(code).toBe("appError:unknown");
    });
  });
});
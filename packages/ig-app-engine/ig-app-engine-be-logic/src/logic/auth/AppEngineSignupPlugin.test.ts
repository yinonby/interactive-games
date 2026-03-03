
import type { AccountsTableAdapter } from '@ig/app-engine-be-models';
import type { CookieUtils } from '@ig/be-utils';
import * as BeUtilsModule from '@ig/be-utils';
import * as UiltsModule from '@ig/utils';
import { type Request, type Response } from 'express';
import { AppEngineSignupPlugin, AppEngineSignupPluginTransaction } from './AppEngineSignupPlugin';

describe('AppEngineSignupPlugin', () => {
  const jwtSecret = 'secret';
  const jwtAlgorithm = 'HS256';
  const jwtExpiresInMs = 1000;
  const jwtCookieDomain = 'localhost';
  const jwtCookieIsSecure = false;
  const spy_buildJWT = vi.spyOn(BeUtilsModule, 'buildJWT');
  const spy_decodeJwt = vi.spyOn(BeUtilsModule, 'decodeJwt');
  const spy_CookieUtils = vi.spyOn(BeUtilsModule, 'CookieUtils');
  const mock_setCookie = vi.fn();

  spy_CookieUtils.mockImplementation(() => ({
    setCookie: mock_setCookie,
  } as unknown as CookieUtils));

  const authJwtPropNames = {
    accountIdFieldName: 'accountId',
    userIdFieldName: 'userId',
    cookieName: 'auth_cookie',
  };

  const user = { userId: 'user-123' };
  const authId = 'account-456';
  const res: Response = {} as Response;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should build JWT and set cookie on signup response', async () => {
    spy_buildJWT.mockReturnValue('mocked-jwt');

    const plugin = new AppEngineSignupPlugin(
      jwtSecret,
      jwtAlgorithm,
      jwtExpiresInMs,
      jwtCookieDomain,
      jwtCookieIsSecure,
      authJwtPropNames,
    );

    await plugin.onSignupResponse(user, authId, res);

    expect(spy_buildJWT).toHaveBeenCalledWith(
      {
        userId: user.userId,
        accountId: authId,
      },
      jwtSecret,
      {
        expiresInMs: jwtExpiresInMs,
        algorithm: jwtAlgorithm,
      },
    );

    expect(mock_setCookie).toHaveBeenCalledWith(
      authJwtPropNames.cookieName,
      'mocked-jwt',
      res,
    );
  });

  describe('extractRequestAuthId', () => {
    it('returns null when no cookies', () => {
      const plugin = new AppEngineSignupPlugin(
        jwtSecret,
        jwtAlgorithm,
        jwtExpiresInMs,
        jwtCookieDomain,
        jwtCookieIsSecure,
        authJwtPropNames,
      );

      const req: Request = {} as Request;
      expect(plugin.extractRequestAuthId(req)).toEqual(null);
    });

    it('returns null when no auth cookie', () => {
      const plugin = new AppEngineSignupPlugin(
        jwtSecret,
        jwtAlgorithm,
        jwtExpiresInMs,
        jwtCookieDomain,
        jwtCookieIsSecure,
        authJwtPropNames,
      );

      const req: Request = { cookies: {} } as Request;
      expect(plugin.extractRequestAuthId(req)).toEqual(null);
    });

    it('fails when decode throws', () => {
      spy_decodeJwt.mockImplementation(() => { throw new Error('ERROR') });

      const plugin = new AppEngineSignupPlugin(
        jwtSecret,
        jwtAlgorithm,
        jwtExpiresInMs,
        jwtCookieDomain,
        jwtCookieIsSecure,
        authJwtPropNames,
      );

      const req: Request = {
        cookies: {
          [authJwtPropNames.cookieName]: 'COOKIE',
        }
      } as Request;
      expect(() => plugin.extractRequestAuthId(req)).toThrowError();
    });

    it('fails when jwt payload is a string', () => {
      spy_decodeJwt.mockReturnValue('invalid string token');

      const plugin = new AppEngineSignupPlugin(
        jwtSecret,
        jwtAlgorithm,
        jwtExpiresInMs,
        jwtCookieDomain,
        jwtCookieIsSecure,
        authJwtPropNames,
      );

      const req: Request = {
        cookies: {
          [authJwtPropNames.cookieName]: 'COOKIE',
        }
      } as Request;
      expect(() => plugin.extractRequestAuthId(req)).toThrowError();
    });

    it('fails when jwt payload does not contain account id', () => {
      spy_decodeJwt.mockReturnValue({});

      const plugin = new AppEngineSignupPlugin(
        jwtSecret,
        jwtAlgorithm,
        jwtExpiresInMs,
        jwtCookieDomain,
        jwtCookieIsSecure,
        authJwtPropNames,
      );

      const req: Request = {
        cookies: {
          [authJwtPropNames.cookieName]: 'COOKIE',
        }
      } as Request;
      expect(() => plugin.extractRequestAuthId(req)).toThrowError();
    });

    it('succeeds  ', () => {
      spy_decodeJwt.mockReturnValue({
        [authJwtPropNames.accountIdFieldName]: 'ACC1'
      });

      const plugin = new AppEngineSignupPlugin(
        jwtSecret,
        jwtAlgorithm,
        jwtExpiresInMs,
        jwtCookieDomain,
        jwtCookieIsSecure,
        authJwtPropNames,
      );

      const req: Request = {
        cookies: {
          [authJwtPropNames.cookieName]: 'COOKIE',
        }
      } as Request;
      expect(plugin.extractRequestAuthId(req)).toEqual('ACC1');
    });
  });
});

describe('AppEngineSignupPluginTransaction', () => {
  const generateUuidv4Spy = vi.spyOn(UiltsModule, 'generateUuidv4');

  const mockAccountsTableAdapter: Partial<AccountsTableAdapter> = {
    createAccount: vi.fn(),
  };

  const ctx = {};
  const user = { userId: 'user-123' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create account and return new account id', async () => {
    generateUuidv4Spy.mockReturnValue('new-account-id');

    const transaction = new AppEngineSignupPluginTransaction(
      mockAccountsTableAdapter as AccountsTableAdapter,
    );

    const result = await transaction.onSignupTransaction(
      user,
      'nickname',
      ctx,
    );

    expect(generateUuidv4Spy).toHaveBeenCalled();

    expect(mockAccountsTableAdapter.createAccount).toHaveBeenCalledWith(
      {
        accountId: 'new-account-id',
        userId: user.userId,
        nickname: 'nickname',
      },
      ctx,
    );

    expect(result).toBe('new-account-id');
  });
});

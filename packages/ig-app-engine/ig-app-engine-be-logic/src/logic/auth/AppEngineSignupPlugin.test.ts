
import type { AccountsTableAdapter } from '@ig/app-engine-be-models';
import type { CookieUtils } from '@ig/be-utils';
import * as BeUtilsModule from '@ig/be-utils';
import * as UiltsModule from '@ig/utils';
import { type Response } from 'express';
import { AppEngineSignupPlugin, AppEngineSignupPluginTransaction } from './AppEngineSignupPlugin';

describe('AppEngineSignupPlugin', () => {
  const jwtSecret = 'secret';
  const jwtAlgorithm = 'HS256';
  const jwtExpiresInMs = 1000;
  const jwtCookieDomain = 'localhost';
  const jwtCookieIsSecure = false;
  const buildJWTSpy = vi.spyOn(BeUtilsModule, 'buildJWT');
  const CookieUtilsSpy = vi.spyOn(BeUtilsModule, 'CookieUtils');
  const mock_setCookie = vi.fn();

  CookieUtilsSpy.mockImplementation(() => ({
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
    buildJWTSpy.mockReturnValue('mocked-jwt');

    const plugin = new AppEngineSignupPlugin(
      jwtSecret,
      jwtAlgorithm,
      jwtExpiresInMs,
      jwtCookieDomain,
      jwtCookieIsSecure,
      authJwtPropNames,
    );

    await plugin.onSignupResponse(user, authId, res);

    expect(buildJWTSpy).toHaveBeenCalledWith(
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
        nickname: '',
      },
      ctx,
    );

    expect(result).toBe('new-account-id');
  });
});


import type { AccountsTableAdapter, UsersTableAdapter } from '@ig/app-engine-be-models';
import type { EmailLoginInputT } from '@ig/auth-models';
import { CookieUtils, type JwtAlgorithmT } from '@ig/be-utils';
import * as IgLib from '@ig/utils';
import { type Response } from 'express';
import { AuthLogic } from './AuthLogic';

describe('AuthLogic', () => {
  const generateUuidv4Spy = vi.spyOn(IgLib, 'generateUuidv4');
  const jwtCookieDomain = "DOMAIN1";
  const jwtSecret = "SECRET1";
  const jwtAlgorithm: JwtAlgorithmT = "HS256";
  const jwtCookieIsSecure = true;
  const jwtExpiresInMs = 100;
  const cookieUtils = new CookieUtils(jwtCookieDomain, jwtCookieIsSecure, jwtExpiresInMs);
  const setCookiespy = vi.spyOn(cookieUtils, 'setCookie');
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCookiespy.mockImplementation(() => {});

  let mock_UsersTableAdapter: UsersTableAdapter;
  let mock_AccountsTableAdapter: AccountsTableAdapter;
  const mock_createUser = vi.fn();
  const mock_createAccount = vi.fn();

  beforeEach(() => {
    // Create a fresh mock before each test
    mock_UsersTableAdapter = {
      getUser: vi.fn(),
      createUser: mock_createUser,
    };

    mock_AccountsTableAdapter = {
      getAccount: vi.fn(),
      createAccount: mock_createAccount,
    };
  });

  it('created with defaults', () => {
    // create
    const logic: AuthLogic = new AuthLogic(jwtSecret, jwtAlgorithm, jwtExpiresInMs, jwtCookieDomain,
      jwtCookieIsSecure, mock_UsersTableAdapter, mock_AccountsTableAdapter);

    // guestLogin
    expect(logic).not.toBeNull();
  });

  it('guestLogin calls table adapter and returns data', async () => {
    const uuidv4 = 'AAA';
    generateUuidv4Spy.mockResolvedValue(uuidv4);

    // create
    const logic: AuthLogic = new AuthLogic(jwtSecret, jwtAlgorithm, jwtExpiresInMs, jwtCookieDomain,
      jwtCookieIsSecure, mock_UsersTableAdapter, mock_AccountsTableAdapter, cookieUtils);

    // guestLogin
    const res: Response = {} as Response;
    const accountId = await logic.guestLogin(res);

    // verify
    expect(mock_createUser).toHaveBeenCalled();
    expect(mock_createAccount).toHaveBeenCalled();
    expect(setCookiespy).toHaveBeenCalled();
    expect(accountId).toEqual(uuidv4);
  });

  it('emailLogin throws', async () => {
    const input: EmailLoginInputT = {
      email: '',
      password: '',
    }

    // create
    const logic: AuthLogic = new AuthLogic(jwtSecret, jwtAlgorithm, jwtExpiresInMs, jwtCookieDomain,
      jwtCookieIsSecure, mock_UsersTableAdapter, mock_AccountsTableAdapter, cookieUtils);

    // emailLogin, verify throws
    const res: Response = {} as Response;
    await expect(logic.emailLogin(input, res)).rejects.toThrow();
  });
});

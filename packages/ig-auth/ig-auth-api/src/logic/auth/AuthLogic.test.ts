
import type { UsersTableAdapter } from '@ig/app-engine-be-models';
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

  let mockTableAdapter: UsersTableAdapter;
  const getUsersMock = vi.fn();
  const getUserMock = vi.fn();
  const createUserMock = vi.fn();

  beforeEach(() => {
    // Create a fresh mock before each test
    mockTableAdapter = {
      getUsers: getUsersMock,
      getUser: getUserMock,
      createUser: createUserMock,
    };

  });

  it('created with defaults', () => {
    // create
    const logic: AuthLogic = new AuthLogic(jwtSecret, jwtAlgorithm, jwtExpiresInMs, jwtCookieDomain,
      jwtCookieIsSecure, mockTableAdapter);

    // guestLogin
    expect(logic).not.toBeNull();
  });

  it('guestLogin calls table adapter and returns data', async () => {
    const uuidv4 = 'AAA';
    generateUuidv4Spy.mockResolvedValue(uuidv4);

    // create
    const logic: AuthLogic = new AuthLogic(jwtSecret, jwtAlgorithm, jwtExpiresInMs, jwtCookieDomain,
      jwtCookieIsSecure, mockTableAdapter, cookieUtils);

    // guestLogin
    const res: Response = {} as Response;
    const userId = await logic.guestLogin(res);

    // verify
    expect(mockTableAdapter.createUser).toHaveBeenCalled();
    expect(setCookiespy).toHaveBeenCalled();
    expect(userId).toEqual(uuidv4);
  });

  it('emailLogin throws', async () => {
    const input: EmailLoginInputT = {
      email: '',
      password: '',
    }

    // create
    const logic: AuthLogic = new AuthLogic(jwtSecret, jwtAlgorithm, jwtExpiresInMs, jwtCookieDomain,
      jwtCookieIsSecure, mockTableAdapter, cookieUtils);

    // emailLogin, verify throws
    const res: Response = {} as Response;
    await expect(logic.emailLogin(input, res)).rejects.toThrow();
  });
});

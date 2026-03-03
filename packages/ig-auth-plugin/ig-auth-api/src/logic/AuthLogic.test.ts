
import type { SignupServiceAdapter } from '@/types/AuthPluginTypes';
import type { EmailLoginInputT } from '@ig/auth-models';
import { type Response } from 'express';
import { AuthLogic } from './AuthLogic';

describe('AuthLogic', () => {
  const mock_authId = 'AUTHID1';
  const mock_signup = vi.fn();
  mock_signup.mockResolvedValue(mock_authId);
  const mock_signupServiceAdapter = {
    signup: mock_signup,
  } as SignupServiceAdapter;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('created with defaults', () => {
    // create
    const logic: AuthLogic = new AuthLogic(mock_signupServiceAdapter);

    // guestLogin
    expect(logic).not.toBeNull();
  });

  it('guestLogin calls table adapter and returns data', async () => {
    // create
    const logic: AuthLogic = new AuthLogic(mock_signupServiceAdapter);

    // guestLogin
    const res: Response = {} as Response;
    const nickname = 'NICKNAME1';
    const authId = await logic.guestLogin(res, nickname);

    // verify
    expect(mock_signup).toHaveBeenCalled();
    expect(authId).toEqual(mock_authId);
  });

  it('emailLogin throws', async () => {
    const input: EmailLoginInputT = {
      email: '',
      password: '',
    }

    // create
    const logic: AuthLogic = new AuthLogic(mock_signupServiceAdapter);

    // emailLogin, verify throws
    const res: Response = {} as Response;
    await expect(logic.emailLogin(input, res)).rejects.toThrow();
  });
});

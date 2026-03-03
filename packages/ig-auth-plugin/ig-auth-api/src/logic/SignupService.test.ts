
import type {
  SignupPluginAdapter,
  SignupServiceTransactionAdapter,
} from '@ig/auth-be-models';
import type { UserT } from '@ig/auth-models';
import type { Response } from 'express';
import { SignupService } from './SignupService';

describe('SignupService', () => {
  const user = { userId: 'user-123' } as UserT;
  const nickname = 'nick';
  const res = {} as Response;

  const mockOnSignup = vi.fn();
  const mockOnSignupResponse = vi.fn();

  let transactionAdapter: SignupServiceTransactionAdapter;
  let pluginAdapter: Partial<SignupPluginAdapter>;

  beforeEach(() => {
    vi.clearAllMocks();

    transactionAdapter = {
      onSignup: mockOnSignup,
    };

    pluginAdapter = {
      onSignupResponse: mockOnSignupResponse,
    };
  });

  it('should call transaction adapter and plugin adapter when plugin is provided', async () => {
    mockOnSignup.mockResolvedValue('auth-999');

    const service = new SignupService(
      transactionAdapter,
      pluginAdapter as SignupPluginAdapter,
    );

    const result = await service.signup(user, nickname, res);

    expect(mockOnSignup).toHaveBeenCalledWith(user, nickname);

    expect(mockOnSignupResponse).toHaveBeenCalledWith(
      user,
      'auth-999',
      res,
    );

    expect(result).toBe('auth-999');
  });

  it('should call transaction adapter and skip plugin when not provided', async () => {
    mockOnSignup.mockResolvedValue('auth-123');

    const service = new SignupService(
      transactionAdapter,
      undefined,
    );

    const result = await service.signup(user, nickname, res);

    expect(mockOnSignup).toHaveBeenCalledWith(user, nickname);

    expect(mockOnSignupResponse).not.toHaveBeenCalled();

    expect(result).toBe('auth-123');
  });
});

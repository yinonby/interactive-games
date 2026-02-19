
import type { UsersTableAdapter } from '@ig/auth-be-models';
import type { MongoTransaction } from '@ig/be-utils';
import * as BeUtilsModule from '@ig/be-utils';
import { MongoSignupServiceTransaction } from './MongoSignupServiceTransaction';

describe('MongoSignupServiceTransaction', () => {
  const ctx = { session: 'mock-session' };

  const user = {
    userId: 'user-123',
  };

  const nickname = 'nick';

  const mock_createUser = vi.fn();
  const usersTableAdapter: Partial<UsersTableAdapter> = {
    createUser: mock_createUser,
  };

  const mock_onSignupTransaction = vi.fn();
  const signupPluginTransactionAdapter = {
    onSignupTransaction: mock_onSignupTransaction,
  };

  const mock_start = vi.fn();
  mock_start.mockResolvedValue(ctx);
  const mock_execute = vi.fn();
  const mock_MongoTransaction = {
    start: mock_start,
    execute: mock_execute,
  } as unknown as MongoTransaction;

  const spy_MongoTransaction = vi.spyOn(BeUtilsModule, 'MongoTransaction');
  spy_MongoTransaction.mockImplementation(() => mock_MongoTransaction);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create adapter with defaults', () => {
    signupPluginTransactionAdapter.onSignupTransaction.mockResolvedValue('auth-999');

    new MongoSignupServiceTransaction(
      usersTableAdapter as UsersTableAdapter,
    );
  });


  it('should create user and call plugin transaction when plugin exists', async () => {
    signupPluginTransactionAdapter.onSignupTransaction.mockResolvedValue('auth-999');

    const adapter = new MongoSignupServiceTransaction(
      usersTableAdapter as UsersTableAdapter,
      signupPluginTransactionAdapter,
    );

    const result = await adapter.onSignup(user, nickname);

    // Transaction started
    expect(mock_start).toHaveBeenCalled();

    // User created inside transaction
    expect(mock_createUser).toHaveBeenCalledWith(user, ctx);

    // Plugin transaction executed
    expect(mock_onSignupTransaction).toHaveBeenCalledWith(user, nickname, ctx);

    // Transaction committed
    expect(mock_execute).toHaveBeenCalled();

    // Returned authId comes from plugin
    expect(result).toBe('auth-999');
  });

  it('should fallback to userId when plugin is not provided', async () => {
    const adapter = new MongoSignupServiceTransaction(
      usersTableAdapter as UsersTableAdapter,
      undefined,
    );

    const result = await adapter.onSignup(user, nickname);

    expect(mock_start).toHaveBeenCalled();

    expect(mock_createUser).toHaveBeenCalledWith(user, ctx);

    expect(mock_execute).toHaveBeenCalled();

    // Returned authId defaults to userId
    expect(result).toBe(user.userId);
  });
});

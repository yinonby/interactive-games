
import type { AccountIdT } from '@ig/app-engine-models';
import type { AuthLogicAdapter } from '@ig/auth-be-models';
import type { EmailLoginInputT, EmailLoginResultDataT, GuestLoginResultDataT } from '@ig/auth-models';
import { createAuthResolvers } from './AuthResolvers';

describe('GameConfigResolvers', () => {
  it('guestLogin calls adapter and returns data', async () => {
    // setup mocks
    const accountId: AccountIdT = 'ACCOUNT1';

    const mockAdapter: Partial<AuthLogicAdapter> = {
      guestLogin: vi.fn().mockResolvedValue(accountId),
    };

    const resolvers = createAuthResolvers(mockAdapter as AuthLogicAdapter);

    // guest login
    const result = await resolvers.Mutation.guestLogin({}, {}, { res: {} });

    // verify
    const expectedResult: GuestLoginResultDataT = { accountId };
    expect(mockAdapter.guestLogin).toHaveBeenCalled();
    expect(result).toEqual(expectedResult);
  });

  it('emailLogin calls adapter and returns data', async () => {
    // setup mocks
    const accountId: AccountIdT = 'ACCOUNT1';

    const mockAdapter: Partial<AuthLogicAdapter> = {
      emailLogin: vi.fn().mockResolvedValue(accountId),
    };

    const resolvers = createAuthResolvers(mockAdapter as AuthLogicAdapter);

    // email login
    const input: EmailLoginInputT = { email: 'EMAIL1', password: 'PASS1' };
    const result = await resolvers.Mutation.emailLogin({}, { input: input }, { res: {} });

    // verify
    const expectedResult: EmailLoginResultDataT = { accountId };
    expect(mockAdapter.emailLogin).toHaveBeenCalledWith(input, {});
    expect(result).toEqual(expectedResult);
  });
});

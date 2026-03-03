
import type { AuthLogicAdapter } from '@ig/auth-be-models';
import type { AuthIdT, EmailLoginInputT, EmailLoginResultDataT, GuestLoginInputT, GuestLoginResultDataT } from '@ig/auth-models';
import { createAuthResolvers } from './AuthResolvers';

describe('GameConfigResolvers', () => {
  it('guestLogin calls adapter and returns data', async () => {
    // setup mocks
    const authId: AuthIdT = 'ACCOUNT1';

    const mockAdapter: Partial<AuthLogicAdapter> = {
      guestLogin: vi.fn().mockResolvedValue(authId),
    };

    const resolvers = createAuthResolvers(mockAdapter as AuthLogicAdapter);

    // guest login
    const input: GuestLoginInputT = { nickname: 'NICKNAME1' };
    const result = await resolvers.Mutation.guestLogin({}, { input }, { res: {} });

    // verify
    const expectedResult: GuestLoginResultDataT = { authId };
    expect(mockAdapter.guestLogin).toHaveBeenCalled();
    expect(result).toEqual(expectedResult);
  });

  it('emailLogin calls adapter and returns data', async () => {
    // setup mocks
    const authId: AuthIdT = 'ACCOUNT1';

    const mockAdapter: Partial<AuthLogicAdapter> = {
      emailLogin: vi.fn().mockResolvedValue(authId),
    };

    const resolvers = createAuthResolvers(mockAdapter as AuthLogicAdapter);

    // email login
    const input: EmailLoginInputT = { email: 'EMAIL1', password: 'PASS1' };
    const result = await resolvers.Mutation.emailLogin({}, { input }, { res: {} });

    // verify
    const expectedResult: EmailLoginResultDataT = { authId };
    expect(mockAdapter.emailLogin).toHaveBeenCalledWith(input, {});
    expect(result).toEqual(expectedResult);
  });
});

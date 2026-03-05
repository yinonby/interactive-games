
import type { AuthGraphqlContextT } from '@/types/AuthInternalTypes';
import type { AuthLogicAdapter } from '@ig/auth-be-models';
import type {
  AuthIdT, EmailLoginInputT, EmailLoginResultDataT,
  GetLoginInfoResultDataT,
  GuestLoginInputT,
  GuestLoginResultDataT
} from '@ig/auth-models';
import { createAuthResolvers } from './AuthResolvers';

describe('GameConfigResolvers', () => {
  it('getLoginInfo calls adapter and returns data', async () => {
    // setup mocks
    const test_authId: AuthIdT = 'USER1';

    const mockAdapter: Partial<AuthLogicAdapter> = {};

    const resolvers = createAuthResolvers(mockAdapter as AuthLogicAdapter);

    // getLoginInfo
    const context = { reqAuthId: test_authId } as AuthGraphqlContextT;
    const result = await resolvers.Query.getLoginInfo({}, {}, context);

    // verify
    const expectedResult: GetLoginInfoResultDataT = { authId: test_authId };
    expect(result).toEqual(expectedResult);
  });

  it('guestLogin calls adapter and returns data', async () => {
    // setup mocks
    const authId: AuthIdT = 'ACCOUNT1';

    const mockAdapter: Partial<AuthLogicAdapter> = {
      guestLogin: vi.fn().mockResolvedValue(authId),
    };

    const resolvers = createAuthResolvers(mockAdapter as AuthLogicAdapter);

    // guest login
    const input: GuestLoginInputT = { nickname: 'NICKNAME1' };
    const context = { res: {} } as AuthGraphqlContextT;
    const result = await resolvers.Mutation.guestLogin({}, { input }, context);

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
    const context = { res: {} } as AuthGraphqlContextT;
    const result = await resolvers.Mutation.emailLogin({}, { input }, context);

    // verify
    const expectedResult: EmailLoginResultDataT = { authId };
    expect(mockAdapter.emailLogin).toHaveBeenCalledWith(input, {});
    expect(result).toEqual(expectedResult);
  });
});

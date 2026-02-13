
import type { AccountT, UserT } from '../../src/types/user/UserTypes';

if (process.env.NODE_ENV !== 'test') {
  throw new Error('TestUtils should only be used in testing');
}

const baseUser: UserT = {
  userId: 'USER1',
};

export const buildFullTestUser = (overrides: Partial<UserT>): UserT => ({
  ...baseUser,
  ...overrides,
});

const baseAccount: AccountT = {
  accountId: 'ACCOUNT1',
  userId: 'USER1',
  nickname: 'NICKNAME1',
};

export const buildFullTestAccount = (overrides: Partial<AccountT>): AccountT => ({
  ...baseAccount,
  ...overrides,
});

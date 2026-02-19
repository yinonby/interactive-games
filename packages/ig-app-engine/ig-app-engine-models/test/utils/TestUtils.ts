
import type { AccountT } from '../../src/types/UserTypes';

if (process.env.NODE_ENV !== 'test') {
  throw new Error('TestUtils should only be used in testing');
}

const baseAccount: AccountT = {
  accountId: 'ACCOUNT1',
  userId: 'USER1',
  nickname: 'NICKNAME1',
};

export const buildFullTestAccount = (overrides: Partial<AccountT>): AccountT => ({
  ...baseAccount,
  ...overrides,
});


import type { UserT } from '../../src/types/user/UserTypes';

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

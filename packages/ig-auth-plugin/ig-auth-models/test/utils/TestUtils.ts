
import type { UserT } from '@ig/auth-models';

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

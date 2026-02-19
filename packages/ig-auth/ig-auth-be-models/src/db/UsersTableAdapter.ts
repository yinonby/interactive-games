
import type { UserIdT, UserT } from '@ig/auth-models';
import type { DbTransactionContext } from '@ig/be-utils';

export interface UsersTableAdapter {
  getUser(userId: UserIdT): Promise<UserT | null>;
  createUser(user: UserT, ctx?: DbTransactionContext): Promise<void>;
}
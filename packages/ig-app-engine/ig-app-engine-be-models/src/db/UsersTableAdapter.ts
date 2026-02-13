
import type { AccountIdT, AccountT, UserIdT, UserT } from '../../../ig-app-engine-models';

export interface UsersTableAdapter {
  getUser(userId: UserIdT): Promise<UserT | null>;
  createUser(user: UserT): Promise<void>;
}

export interface AccountsTableAdapter {
  getAccount(accountId: AccountIdT): Promise<AccountT | null>;
  createAccount(acconut: AccountT): Promise<void>;
}

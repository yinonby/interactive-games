
import type { AccountIdT, AccountT } from '@ig/app-engine-models';
import type { DbTransactionContext } from '@ig/be-utils';

export interface AccountsTableAdapter {
  getAccount(accountId: AccountIdT): Promise<AccountT | null>;
  createAccount(account: AccountT, ctx?: DbTransactionContext): Promise<void>;
}

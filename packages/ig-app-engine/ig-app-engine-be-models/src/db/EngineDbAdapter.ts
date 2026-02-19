
import type { AccountsTableAdapter } from './UsersTableAdapter';

export interface EngineDbAdapter {
  getAccountsTableAdapter: (
    tableNamePrefix?: string,
  ) => AccountsTableAdapter;
}

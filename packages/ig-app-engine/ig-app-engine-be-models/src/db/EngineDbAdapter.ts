
import type { AccountsTableAdapter, UsersTableAdapter } from './UsersTableAdapter';

export interface EngineDbAdapter {
  getUsersTableAdapter: (
    tableNamePrefix?: string,
  ) => UsersTableAdapter;

  getAccountsTableAdapter: (
    tableNamePrefix?: string,
  ) => AccountsTableAdapter;
}

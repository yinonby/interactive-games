
import type { UsersTableAdapter } from './UsersTableAdapter';

export interface EngineDbAdapter {
  getUsersTableAdapter: (
    tableNamePrefix?: string,
  ) => UsersTableAdapter;
}


import type { SignupPluginTransactionAdapter, SignupServiceTransactionAdapter } from '../logic/AuthLogicTypes';
import type { UsersTableAdapter } from './UsersTableAdapter';

export interface AuthDbAdapter {
  getUsersTableAdapter: (
    tableNamePrefix?: string,
  ) => UsersTableAdapter;

  getSignupServiceTransactionAdapter: (
    tableNamePrefix?: string,
    signupPluginTransactionAdapter?: SignupPluginTransactionAdapter,
  ) => SignupServiceTransactionAdapter;
}


import type { SignupPluginAdapter, SignupServiceTransactionAdapter } from '@ig/auth-be-models';
import type { AuthIdT, UserT } from '@ig/auth-models';
import type { Response } from 'express';

export type AuthPluginConfigT = {
  getSignupServiceTransactionAdapter: () => SignupServiceTransactionAdapter,
  getSignupPluginAdapter: () => SignupPluginAdapter,
}

export interface SignupServiceAdapter {
  signup(user: UserT, nickname: string, res: Response): Promise<AuthIdT>;
}

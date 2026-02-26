
import type { AuthIdT, EmailLoginInputT, UserT } from '@ig/auth-models';
import type { DbTransactionContext } from '@ig/be-utils';
import { type Response } from 'express';

export interface AuthLogicAdapter {
  guestLogin(res: Response): Promise<AuthIdT>;
  emailLogin(input: EmailLoginInputT, res: Response): Promise<AuthIdT>;
}

// exported to be implemented by auth DB package
export interface SignupServiceTransactionAdapter {
  onSignup(user: UserT, nickname: string): Promise<AuthIdT>;
}

// exported to be implemented by the signup plugin
export interface SignupPluginAdapter {
  onSignupResponse(user: UserT, authId: AuthIdT, res: Response): Promise<void>;
}

// exported to be implemented by the signup plugin's DB package
export interface SignupPluginTransactionAdapter {
  onSignupTransaction(user: UserT, nickname: string, ctx: DbTransactionContext): Promise<AuthIdT>;
}

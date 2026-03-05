
import type { SignupPluginAdapter, SignupServiceTransactionAdapter } from '@ig/auth-be-models';
import type { AuthIdT, UserT } from '@ig/auth-models';
import type { Request, Response } from 'express';

export type AuthPluginConfigT = {
  getSignupServiceTransactionAdapter: () => SignupServiceTransactionAdapter,
  getSignupPluginAdapter: () => SignupPluginAdapter,
}

export interface ApolloContextT {
  req: Request;
  res: Response;
}

export interface SignupServiceAdapter {
  signup(user: UserT, nickname: string, res: Response): Promise<AuthIdT>;
}

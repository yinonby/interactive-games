
import type {
  SignupPluginAdapter,
  SignupServiceTransactionAdapter,
} from '@ig/auth-be-models';
import type { AuthIdT, UserT } from '@ig/auth-models';
import { type Response } from 'express';
import type { SignupServiceAdapter } from '../types/AuthPluginTypes';

export class SignupService implements SignupServiceAdapter {
  constructor(
    private readonly signupServiceTransactionAdapter: SignupServiceTransactionAdapter,
    private readonly signupPluginAdapter?: SignupPluginAdapter,
  ) {}

  async signup(user: UserT, nickname: string, res: Response): Promise<AuthIdT> {
    const authId: AuthIdT = await this.signupServiceTransactionAdapter.onSignup(user, nickname);

    if (this.signupPluginAdapter !== undefined) {
      // if signupPluginAdapter is provided, it may manipulate the response
      await this.signupPluginAdapter.onSignupResponse(user, authId, res);
    }

    return authId;
  }
}

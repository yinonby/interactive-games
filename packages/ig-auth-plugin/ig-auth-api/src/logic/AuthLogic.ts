
import type {
  AuthLogicAdapter,
} from '@ig/auth-be-models';
import type { AuthIdT, EmailLoginInputT, UserT } from '@ig/auth-models';
import { generateUuidv4 } from '@ig/utils';
import { type Response } from 'express';
import type { SignupServiceAdapter } from '../types/AuthPluginTypes';

export class AuthLogic implements AuthLogicAdapter {
  constructor(
    private readonly signupServiceAdapter: SignupServiceAdapter,
  ) { }

  public async guestLogin(res: Response): Promise<AuthIdT> {
    const newUserId = generateUuidv4();
    const newUser: UserT = {
      userId: newUserId,
    }

    const nickname = '';

    // create user and account in db (in transaction)
    const authId = await this.signupServiceAdapter.signup(newUser, nickname, res);

    return authId;
  }

  // eslint-disable-next-line @typescript-eslint/require-await,@typescript-eslint/no-unused-vars
  public async emailLogin(input: EmailLoginInputT, res: Response): Promise<AuthIdT> {
    throw new Error('Method not implemented.');
  }
}


import type { AccountIdT } from '@ig/app-engine-models';
import type { EmailLoginInputT } from '@ig/auth-models';
import { type Response } from 'express';

export interface AuthLogicAdapter {
  guestLogin(res: Response): Promise<AccountIdT>;
  emailLogin(input: EmailLoginInputT, res: Response): Promise<AccountIdT>;
}


import type { UserIdT } from '@ig/app-engine-models';
import type { EmailLoginInputT } from '@ig/auth-models';
import { type Response } from 'express';

export interface AuthLogicAdapter {
  guestLogin(res: Response): Promise<UserIdT>;
  emailLogin(input: EmailLoginInputT, res: Response): Promise<UserIdT>;
}


import type { EmailLoginInputT } from '@ig/auth-models';
import type { UserIdT } from '@ig/engine-models';
import { type Response } from 'express';

export interface AuthLogicAdapter {
  guestLogin(res: Response): Promise<UserIdT>;
  emailLogin(input: EmailLoginInputT, res: Response): Promise<UserIdT>;
}


import type { AuthIdT } from '@ig/auth-models';
import type { Request, Response } from 'express';

export interface AuthGraphqlContextT {
  req: Request,
  res: Response,
  reqAuthId: AuthIdT | null,
}
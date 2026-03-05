
import type { SignupPluginAdapter } from '@ig/auth-be-models';
import type { AuthIdT } from '@ig/auth-models';
import type { Request, Response } from 'express';
import type { AuthGraphqlContextT } from '../../types/AuthInternalTypes';

export const buildContext = async (
  req: Request,
  res: Response,
  signupPluginAdapter: SignupPluginAdapter,
): Promise<AuthGraphqlContextT> => {
  const reqAuthId: AuthIdT | null = await signupPluginAdapter.extractRequestAuthId(req);

  return { req, res, reqAuthId };
};


import type { AuthLogicAdapter } from '@ig/auth-be-models';
import type { Request, Response } from 'express';

export type AuthPluginConfigT = {
  getAuthLogicAdapter: () => AuthLogicAdapter,
}

export interface ApolloContextT {
  req: Request;
  res: Response;
}

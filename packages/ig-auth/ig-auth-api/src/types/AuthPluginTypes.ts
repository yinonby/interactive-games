
import type { JwtAlgorithmT } from '@ig/be-utils';
import type { Request, Response } from 'express';

export type AuthPluginConfigT = {
  jwtSecret: string,
  jwtAlgorithm: JwtAlgorithmT,
  jwtExpiresInMs: number,
  jwtCookieDomain: string,
  jwtCookieIsSecure: boolean,
}

export interface ApolloContextT {
  req: Request;
  res: Response;
}

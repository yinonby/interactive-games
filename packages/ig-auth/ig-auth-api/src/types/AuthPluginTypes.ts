
import type { JwtAlgorithmT } from '@ig/be-lib';
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

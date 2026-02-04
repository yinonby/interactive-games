
import type { SignOptions } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

/**
 * Type for the payload you want to encode in the JWT.
 * Replace `Record<string, unknown>` with a stricter type if you want.
 */
export type JWTPayload = Record<string, unknown>;


/**
 * Options for signing the JWT
 */
export type JwtAlgorithmT = jwt.Algorithm;
export interface JWTSignOptions {
  expiresInMs: number; // e.g., '1h', '7d', 3600
  algorithm: JwtAlgorithmT;   // HS256, RS256, etc.
}

/**
 * Generate a JWT given a payload and a secret
 * @param payload - JSON payload to encode
 * @param secret - secret string used to sign
 * @param options - optional JWT options
 * @returns signed JWT string
 */
export function buildJWT(
  payload: JWTPayload,
  secret: string,
  options: JWTSignOptions
): string {
  const signOptions: SignOptions = {
    expiresIn: options.expiresInMs,
    algorithm: options.algorithm,
  };

  return jwt.sign(payload, secret, signOptions);
}

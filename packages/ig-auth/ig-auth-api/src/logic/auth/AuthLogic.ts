
import type { AuthLogicAdapter } from '@ig/auth-be-models';
import type { EmailLoginInputT } from '@ig/auth-models';
import { buildJWT, CookieUtils, type JwtAlgorithmT } from '@ig/be-lib';
import type { UsersTableAdapter } from '@ig/engine-be-models';
import type { UserIdT, UserT } from '@ig/engine-models';
import { generateUuidv4 } from '@ig/lib';
import { type Response } from 'express';
import { AUTH_JWT_COOKIE_NAME, AUTH_JWT_USER_ID_FIELD_NAME } from '../../types/AuthDefs';

export class AuthLogic implements AuthLogicAdapter {
  constructor(
    private jwtSecret: string,
    private jwtAlgorithm: JwtAlgorithmT,
    private jwtExpiresInMs: number,
    jwtCookieDomain: string,
    jwtCookieIsSecure: boolean,
    private usersTableAdapter: UsersTableAdapter,
    private cookieUtils = new CookieUtils(jwtCookieDomain, jwtCookieIsSecure, jwtExpiresInMs),
  ) { }

  public async guestLogin(res: Response): Promise<UserIdT> {
    const newUserId = generateUuidv4();
    const newUser: UserT = {
      userId: newUserId,
    }

    // create user in db
    await this.usersTableAdapter.createUser(newUser);

    // set jwt cookie
    this.setJwt(newUserId, res);

    return newUserId;
  }

  // eslint-disable-next-line @typescript-eslint/require-await,@typescript-eslint/no-unused-vars
  public async emailLogin(input: EmailLoginInputT, res: Response): Promise<UserIdT> {
    throw new Error('Method not implemented.');
  }

  // service methods

  private setJwt(userId: UserIdT, res: Response): void {
    const jwt = buildJWT({
      [AUTH_JWT_USER_ID_FIELD_NAME]: userId,
    }, this.jwtSecret, {
      expiresInMs: this.jwtExpiresInMs,
      algorithm: this.jwtAlgorithm,
    });

    this.cookieUtils.setCookie(AUTH_JWT_COOKIE_NAME, jwt, res);
  }
}


import type { AccountsTableAdapter, UsersTableAdapter } from '@ig/app-engine-be-models';
import type { AccountIdT, AccountT, UserIdT, UserT } from '@ig/app-engine-models';
import type { AuthLogicAdapter } from '@ig/auth-be-models';
import type { EmailLoginInputT } from '@ig/auth-models';
import { buildJWT, CookieUtils, type JwtAlgorithmT } from '@ig/be-utils';
import { generateUuidv4 } from '@ig/utils';
import { type Response } from 'express';
import {
  AUTH_JWT_ACCOUNT_ID_FIELD_NAME,
  AUTH_JWT_COOKIE_NAME,
  AUTH_JWT_USER_ID_FIELD_NAME
} from '../../types/AuthDefs';

export class AuthLogic implements AuthLogicAdapter {
  constructor(
    private jwtSecret: string,
    private jwtAlgorithm: JwtAlgorithmT,
    private jwtExpiresInMs: number,
    jwtCookieDomain: string,
    jwtCookieIsSecure: boolean,
    private usersTableAdapter: UsersTableAdapter,
    private accountsTableAdapter: AccountsTableAdapter,
    private cookieUtils = new CookieUtils(jwtCookieDomain, jwtCookieIsSecure, jwtExpiresInMs),
  ) { }

  public async guestLogin(res: Response): Promise<AccountIdT> {
    const newUserId = generateUuidv4();
    const newUser: UserT = {
      userId: newUserId,
    }

    const newAccountId = generateUuidv4();
    const newAccount: AccountT = {
      accountId: newAccountId,
      userId: newUserId,
      nickname: "",
    }

    // TODO: change this to transaction
    // create user and account in db
    await this.usersTableAdapter.createUser(newUser);
    await this.accountsTableAdapter.createAccount(newAccount);

    // set jwt cookie
    this.setJwt(newUserId, newAccountId, res);

    return newAccountId;
  }

  // eslint-disable-next-line @typescript-eslint/require-await,@typescript-eslint/no-unused-vars
  public async emailLogin(input: EmailLoginInputT, res: Response): Promise<AccountIdT> {
    throw new Error('Method not implemented.');
  }

  // service methods

  private setJwt(userId: UserIdT, accountId: AccountIdT, res: Response): void {
    const jwt = buildJWT({
      [AUTH_JWT_USER_ID_FIELD_NAME]: userId,
      [AUTH_JWT_ACCOUNT_ID_FIELD_NAME]: accountId,
    }, this.jwtSecret, {
      expiresInMs: this.jwtExpiresInMs,
      algorithm: this.jwtAlgorithm,
    });

    this.cookieUtils.setCookie(AUTH_JWT_COOKIE_NAME, jwt, res);
  }
}

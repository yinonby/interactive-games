
import type { AccountsTableAdapter } from '@ig/app-engine-be-models';
import type { AccountIdT, AccountT } from '@ig/app-engine-models';
import type { SignupPluginAdapter, SignupPluginTransactionAdapter } from '@ig/auth-be-models';
import type { AuthIdT, UserIdT, UserT } from '@ig/auth-models';
import { buildJWT, CookieUtils, type DbTransactionContext, type JwtAlgorithmT } from '@ig/be-utils';
import { generateUuidv4 } from '@ig/utils';
import { type Response } from 'express';

export type AuthJwtPropNamesT = {
  accountIdFieldName: string,
  userIdFieldName: string,
  cookieName: string,
}

export class AppEngineSignupPlugin implements SignupPluginAdapter {
  constructor(
    private jwtSecret: string,
    private jwtAlgorithm: JwtAlgorithmT,
    private jwtExpiresInMs: number,
    jwtCookieDomain: string,
    jwtCookieIsSecure: boolean,
    private readonly authJwtPropNames: AuthJwtPropNamesT,
    private cookieUtils = new CookieUtils(jwtCookieDomain, jwtCookieIsSecure, jwtExpiresInMs),
  ) { }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async onSignupResponse(user: UserT, authId: AuthIdT, res: Response): Promise<void> {
    // set jwt cookie
    const accountId = authId as AccountIdT;
    this.setJwt(user.userId, accountId, res);
  }

  // service methods

  private setJwt(userId: UserIdT, accountId: AccountIdT, res: Response): void {
    const jwt = buildJWT({
      [this.authJwtPropNames.userIdFieldName]: userId,
      [this.authJwtPropNames.accountIdFieldName]: accountId,
    }, this.jwtSecret, {
      expiresInMs: this.jwtExpiresInMs,
      algorithm: this.jwtAlgorithm,
    });

    this.cookieUtils.setCookie(this.authJwtPropNames.cookieName, jwt, res);
  }
}

export class AppEngineSignupPluginTransaction implements SignupPluginTransactionAdapter {
  constructor(
    private readonly accountsTableAdapter: AccountsTableAdapter,
  ) { }

  public async onSignupTransaction(user: UserT, nickname: string, ctx: DbTransactionContext): Promise<AuthIdT> {
    const newAccountId = generateUuidv4();
    const newAccount: AccountT = {
      accountId: newAccountId,
      userId: user.userId,
      nickname: "",
    }

    await this.accountsTableAdapter.createAccount(newAccount, ctx);

    return newAccountId as AuthIdT;
  }
}



import type { AccountsTableAdapter } from '@ig/app-engine-be-models';
import type { AccountIdT, AccountT } from '@ig/app-engine-models';
import type { SignupPluginAdapter, SignupPluginTransactionAdapter } from '@ig/auth-be-models';
import type { AuthIdT, UserIdT, UserT } from '@ig/auth-models';
import {
  BeLogger, buildJWT, CookieUtils, decodeJwt,
  type DbTransactionContext, type JwtAlgorithmT, type JWTPayload
} from '@ig/be-utils';
import { generateUuidv4, type LoggerAdapter } from '@ig/utils';
import { type Request, type Response } from 'express';
import { EngineApiError } from '../../types/EngineApiTypes';

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
    private getAccountsTableAdapter: () => AccountsTableAdapter,
    private cookieUtils = new CookieUtils(jwtCookieDomain, jwtCookieIsSecure, jwtExpiresInMs),
    private logger: LoggerAdapter = new BeLogger(),
  ) { }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async onSignupResponse(user: UserT, authId: AuthIdT, res: Response): Promise<void> {
    // set jwt cookie
    const accountId = authId as AccountIdT;
    this.setJwt(user.userId, accountId, res);
  }

  public async extractRequestAuthId(req: Request): Promise<AuthIdT | null> {
    if (req.cookies === undefined) {
      this.logger.debug('Missing request cookies');
      return null;
    }

    const cookie = req.cookies[this.authJwtPropNames.cookieName];
    if (cookie === undefined) {
      this.logger.debug('Missing Jwt token cookie');
      return null;
    }

    let decodedJwt: string | JWTPayload;
    try {
      decodedJwt = decodeJwt(cookie, this.jwtSecret);
    } catch (error: unknown) {
      this.logger.debug('Invalid Jwt token', error);
      throw new EngineApiError('Invalid Jwt token', 'engineApiError:invalidJwt');
    }

    if (typeof decodedJwt === 'string') {
      this.logger.debug('Invalid Jwt payload');
      throw new EngineApiError('Invalid Jwt payload', 'engineApiError:invalidJwt');
    }

    if (decodedJwt[this.authJwtPropNames.accountIdFieldName] === undefined) {
      this.logger.debug('Jwt token missing account id');
      throw new EngineApiError('Jwt token missing account id', 'engineApiError:invalidJwt');
    }

    const accountId: AccountIdT = decodedJwt[this.authJwtPropNames.accountIdFieldName] as AccountIdT;
    const account: AccountT | null = await this.getAccountsTableAdapter().getAccount(accountId);
    if (account === null) {
      this.logger.debug(`Account does not exist, accountId [${accountId}]`);
      return null;
    }

    return accountId as AuthIdT;
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
      nickname: nickname,
    }

    await this.accountsTableAdapter.createAccount(newAccount, ctx);

    return newAccountId as AuthIdT;
  }
}


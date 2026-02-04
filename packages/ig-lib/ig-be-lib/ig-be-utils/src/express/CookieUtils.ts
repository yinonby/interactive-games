
import { type Response } from 'express';

export class CookieUtils {
  constructor(
    private cookieDomain: string,
    private cookieIsSecure: boolean,
    private cookieExpiresInMs: number,
  ) { }

  public setCookie(cookieName: string, cookieVal: string, res: Response): void {
    // Set a cookie
    res.cookie(cookieName, cookieVal, {
      httpOnly: true, // cookie not accessible via JS (recommended for auth)
      secure: this.cookieIsSecure,
      sameSite: this.cookieIsSecure ? "none" : "lax",
      maxAge: this.cookieExpiresInMs,
      domain: this.cookieDomain,
    });
  }
}

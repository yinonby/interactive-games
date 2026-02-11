
import type { Response } from 'express';
import { CookieUtils } from './CookieUtils';

describe("CookieUtils", () => {
  it("sets a secure cookie with SameSite=None when secure is true", () => {
    const cookieUtils = new CookieUtils(
      "fake.domain",
      true,
      1000 * 60 * 60
    );

    const res = {
      cookie: vi.fn(),
    } as unknown as Response;

    cookieUtils.setCookie("AUTH", "jwt-token", res);

    expect(res.cookie).toHaveBeenCalledOnce();
    expect(res.cookie).toHaveBeenCalledWith(
      "AUTH",
      "jwt-token",
      {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60,
        domain: "fake.domain",
      }
    );
  });

  it("sets a non-secure cookie with SameSite=Lax when secure is false", () => {
    const cookieUtils = new CookieUtils(
      "fake.domain",
      false,
      5000
    );

    const res = {
      cookie: vi.fn(),
    } as unknown as Response;

    cookieUtils.setCookie("AUTH", "jwt-token", res);

    expect(res.cookie).toHaveBeenCalledWith(
      "AUTH",
      "jwt-token",
      {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 5000,
        domain: "fake.domain",
      }
    );
  });
});

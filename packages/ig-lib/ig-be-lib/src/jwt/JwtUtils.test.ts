
import jwt from "jsonwebtoken";
import type { JWTPayload } from "./JwtUtils";
import { buildJWT } from "./JwtUtils";

describe("buildJWT", () => {
  const secret = "test-secret";

  it("should generate a valid JWT with the given payload", () => {
    const payload: JWTPayload = {
      userId: "123",
      role: "admin",
    };

    const token = buildJWT(payload, secret, { expiresIn: 60, algorithm: "HS512" });

    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

    expect(decoded.userId).toBe("123");
    expect(decoded.role).toBe("admin");
  });

  it("should respect expiresIn option", () => {
    const payload: JWTPayload = { foo: "bar" };

    const token = buildJWT(payload, secret, { expiresIn: 60, algorithm: "HS512" });

    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;


    if (typeof decoded === "string") {
      throw new Error("Expected decoded JWT payload to be an object");
    }

    expect(decoded.exp).toBeDefined();
    expect(decoded.iat).toBeDefined();

    if (decoded.exp === undefined || decoded.iat === undefined) {
      throw new Error("Expected exp and iat to be defined");
    }

    expect(decoded.exp - decoded.iat).toBe(60);
  });

  it("should use the specified algorithm", () => {
    const payload: JWTPayload = { test: true };

    const token = buildJWT(payload, secret, { expiresIn: 60, algorithm: "HS512" });

    const decoded = jwt.decode(token, { complete: true });

    if (!decoded || typeof decoded === "string") {
      throw new Error("Expected decoded token with header");
    }

    expect(decoded.header.alg).toBe("HS512");
  });

  it("should throw if secret is invalid", () => {
    const payload: JWTPayload = { foo: "bar" };

    const token = buildJWT(payload, secret, { expiresIn: 60, algorithm: "HS512" });

    expect(() => {
      jwt.verify(token, "wrong-secret");
    }).toThrow();
  });
});

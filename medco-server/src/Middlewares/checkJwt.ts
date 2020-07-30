import { encode, decode, TAlgorithm } from "jwt-simple";
import {
  PartialSession,
  EncodeResult,
  ISession,
  DecodeResult,
  ExpirationStatus,
} from "../Types/auth";

import { Request, Response, NextFunction } from "express";
import { IUser } from "../Types";
import AuthKey from "../config/config";
// Always use HS512 to sign the token
const algorithm: TAlgorithm = "HS512";

export function encodeSession(
  secretKey: string,
  partialSession: PartialSession
): EncodeResult {
  // Determine when the token should expire
  const issued: number = Date.now();
  const fifteenMinutesInMs = 15 * 60 * 1000;
  const expires = issued + fifteenMinutesInMs;
  const session: ISession = {
    id: partialSession.id,
    dateCreated: partialSession.dateCreated,
    username: partialSession.username,
    issued: issued,
    expires: expires,
  };

  return {
    token: encode(session, secretKey, algorithm),
    issued: issued,
    expires: expires,
  };
}

export function decodeSession(
  secretKey: string,
  tokenString: string
): DecodeResult {
  let result: ISession;

  try {
    result = decode(tokenString, secretKey, undefined, algorithm);
  } catch (_e) {
    const e: Error = _e;

    // These error strings can be found here:
    // https://github.com/hokaccha/node-jwt-simple/blob/c58bfe5e5bb049015fcd55be5fc1b2d5c652dbcd/lib/jwt.js
    if (
      e.message === "No token supplied" ||
      e.message === "Not enough or too many segments"
    ) {
      return {
        type: "invalid-token",
      };
    }

    if (
      e.message === "Signature verification failed" ||
      e.message === "Algorithm not supported"
    ) {
      return {
        type: "integrity-error",
      };
    }

    // Handle json parse errors, thrown when the payload is nonsense
    if (e.message.indexOf("Unexpected token") === 0) {
      return {
        type: "invalid-token",
      };
    }

    throw e;
  }

  return {
    type: "valid",
    session: result,
  };
}

export function checkExpirationStatus(token: ISession): ExpirationStatus {
  const now = Date.now();

  if (token.expires > now) return "active";

  // Find the timestamp for the end of the token's grace period
  const threeHoursInMs = 3 * 60 * 60 * 1000;
  const threeHoursAfterExpiration = token.expires + threeHoursInMs;

  if (threeHoursAfterExpiration > now) return "grace";

  return "expired";
}

/**
 * Express middleware, checks for a valid JSON Web Token and returns 401 Unauthorized if one isn't found.
 */
export function requireJwtMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const unauthorized = (message: string) =>
    response.status(401).json({
      ok: false,
      status: 401,
      message: message,
    });

  const requestHeader = "auth-cookie";
  const responseHeader = "auth-cookie";
  const header = request.header(requestHeader);

  if (!header) {
    unauthorized(`Required ${requestHeader} header not found.`);
    return;
  }

  const decodedSession: DecodeResult = decodeSession("SECRET_KEY_HERE", header);

  if (
    decodedSession.type === "integrity-error" ||
    decodedSession.type === "invalid-token"
  ) {
    unauthorized(
      `Failed to decode or validate authorization token. Reason: ${decodedSession.type}.`
    );
    return;
  }

  const expiration: ExpirationStatus = checkExpirationStatus(
    decodedSession.session
  );

  if (expiration === "expired") {
    unauthorized(
      `Authorization token has expired. Please create a new authorization token.`
    );
    return;
  }

  let session: ISession;

  if (expiration === "grace") {
    // Automatically renew the session and send it back with the response
    const { token, expires, issued } = encodeSession(
      AuthKey.jwtSecret,
      decodedSession.session
    );
    session = {
      ...decodedSession.session,
      expires: expires,
      issued: issued,
    };

    response.setHeader(responseHeader, token);
  } else {
    session = decodedSession.session;
  }

  // Set the session on response.locals object for routes to access
  response.locals = {
    ...response.locals,
    session: session,
  };

  // Request has a valid or renewed session. Call next to continue to the authenticated route handler
  next();
}
export function getToken(request: Request, response: Response, user: IUser) {
  const partialSession = {
    id: 45645,
    username: user.username,
    dateCreated: Date.now(),
  };
  const { token } = encodeSession(AuthKey.jwtSecret, partialSession);
  return token;
}
export function setToken(request: Request, response: Response, user: IUser) {
  const token = getToken(request,response,user)
  const responseHeader = "auth-cookie";
  response.setHeader(responseHeader, token);
}

export function getUsernamefromToken(request: Request) {
  const requestHeader = "auth-cookie";
  const header = request.header(requestHeader);
  if (header) {
    const decodedSession: DecodeResult = decodeSession(
      "SECRET_KEY_HERE",
      header
    );
    if (decodedSession.type === "valid") {
      return decodedSession.session.username;
    }
  }
  return undefined;
}

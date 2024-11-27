import { MOCK_USER_ID } from "../mocks/constants";
import { Request, Response, NextFunction } from "express";
import { auth } from "express-oauth2-jwt-bearer";

const isMock = process.env.USE_MOCK === "true";

export const checkJwt = isMock
  ? (_req: Request, _res: Response, next: NextFunction) => next()
  : auth({
      audience: process.env.AUTH0_AUDIENCE,
      issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    });

export const attachUserId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (isMock) {
    req.userId = MOCK_USER_ID;
    next();
    return;
  }

  if (!req.auth || !req.auth.payload || !req.auth.payload.sub) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  req.userId = req.auth.payload.sub as string;
  next();
};

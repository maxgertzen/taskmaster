import { MOCK_USER_ID } from "../mocks/constants";
import { Request, Response, NextFunction } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import { resolveUserId } from "../utils/resolveUserId";

const isMock = process.env.USE_MOCK === "true";

export const checkJwt = isMock
  ? (_req: Request, _res: Response, next: NextFunction) => next()
  : auth({
      audience: process.env.AUTH0_AUDIENCE,
      issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    });

export const attachUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (isMock) {
      const userId = await resolveUserId(MOCK_USER_ID);
      req.userId = userId;
      next();
      return;
    }

    const auth = req.auth?.payload;

    if (!auth?.sub) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const auth0Id = auth.sub;
    const email = (auth.email as string) || "";
    const name = (auth.name as string) || "";

    const userId = await resolveUserId(auth0Id, email, name);

    req.userId = userId;

    next();
  } catch (error) {
    next(error);
  }
};

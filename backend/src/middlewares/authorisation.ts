import { auth } from "express-oauth2-jwt-bearer";
import { Request, Response, NextFunction } from "express";

export const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
});

export const attachUserId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.auth || !req.auth.payload || !req.auth?.payload?.sub) {
    res.status(401).json({ message: "Unauthorized" });
  }

  req.userId = req.auth?.payload.sub as string;
  next();
};

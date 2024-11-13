import { Request, Response, NextFunction } from "express";

export const transformCompletedToString = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (req.body && typeof req.body.completed === "boolean") {
    req.body.completed = req.body.completed.toString();
  }
  next();
};

import { Request, Response, NextFunction } from "express";
import { DatabaseError, HttpError } from "@src/errors";
import mongoose, { MongooseError } from "mongoose";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  if (err instanceof HttpError) {
    res.status(err.status).json(err.response);
  }

  if (err instanceof MongooseError || err instanceof mongoose.Error) {
    const updatedError = new DatabaseError(
      err.message,
      {
        name: err.name,
        message: err.message,
        stack: err.stack,
      },
      err
    );
    res.status(updatedError.status).json(updatedError.response);
  }

  if (res.headersSent) {
    next(err);
  }

  res.status(500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
    status: 500,
  });
};

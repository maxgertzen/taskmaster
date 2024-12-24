import { errorHandler } from "@middlewares/errorHandler";
import { Request, Response } from "express";

describe("errorHandler middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {};
    res = {
      headersSent: false,
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should log the error and send a 500 response when headers are not sent", () => {
    const error = new Error("Test error");
    console.error = jest.fn();

    errorHandler(error, req as Request, res as Response, next);

    expect(console.error).toHaveBeenCalledWith(error.stack);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Test error" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next(err) when headers are already sent", () => {
    res.headersSent = true;
    const error = new Error("Test error");

    errorHandler(error, req as Request, res as Response, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});

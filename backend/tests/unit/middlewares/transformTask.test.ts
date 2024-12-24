import { transformCompletedToString } from "@middlewares/transformTask";
import { Request, Response } from "express";

describe("transformCompletedToString middleware", () => {
  let req: Partial<Request>;
  let next: jest.Mock;

  beforeEach(() => {
    req = { body: {} };
    next = jest.fn();
  });

  it("should transform completed from boolean to string", () => {
    req.body = { completed: true };

    transformCompletedToString(req as Request, {} as Response, next);

    expect(req.body.completed).toBe("true");
    expect(next).toHaveBeenCalled();
  });

  it("should not modify completed if it is already a string", () => {
    req.body = { completed: "true" };

    transformCompletedToString(req as Request, {} as Response, next);

    expect(req.body.completed).toBe("true");
    expect(next).toHaveBeenCalled();
  });

  it("should not modify completed if it is undefined", () => {
    req.body = {};

    transformCompletedToString(req as Request, {} as Response, next);

    expect(req.body.completed).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });

  it("should not modify completed if it is neither a boolean nor a string", () => {
    req.body = { completed: 123 };

    transformCompletedToString(req as Request, {} as Response, next);

    expect(req.body.completed).toBe(123);
    expect(next).toHaveBeenCalled();
  });
});

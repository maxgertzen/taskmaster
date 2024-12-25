import { validateRequestBody } from "@middlewares/validateRequestBody";
import { ValidationSchema } from "@src/validation";
import { Request, Response } from "express";

describe("validateRequestBody middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should pass validation for valid input: create list", () => {
    req.body = { name: "Valid List Name" };

    const schema: ValidationSchema = [{ field: "name", type: "string" }];

    validateRequestBody(schema)(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should fail validation for invalid input: create list", () => {
    const schema: ValidationSchema = [{ field: "name", type: "string" }];

    validateRequestBody(schema)(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: ["name is required"],
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should pass validation for valid input: update list", () => {
    req.body = { id: "123", name: "Updated List Name" };

    const schema: ValidationSchema = [
      { field: "id", type: "string" },
      { field: "name", type: "string" },
    ];

    validateRequestBody(schema)(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should fail validation for invalid input: update list", () => {
    req.body = { name: "Updated List Name" };

    const schema: ValidationSchema = [
      { field: "id", type: "string" },
      { field: "name", type: "string" },
    ];

    validateRequestBody(schema)(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: ["id is required"],
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should pass validation for valid input: reorder lists", () => {
    req.body = { orderedIds: ["id1", "id2"] };

    const schema: ValidationSchema = [{ field: "orderedIds", type: "array" }];

    validateRequestBody(schema)(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should fail validation for invalid input: reorder lists", () => {
    req.body = { orderedIds: [] };

    const schema: ValidationSchema = [{ field: "orderedIds", type: "array" }];

    validateRequestBody(schema)(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: ["orderedIds must not be empty"],
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should pass validation for valid input: toggle complete all", () => {
    req.body = { listId: "list123", newCompletedState: true };

    const schema: ValidationSchema = [
      { field: "listId", type: "string" },
      { field: "newCompletedState", type: "boolean" },
    ];

    validateRequestBody(schema)(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should fail validation for invalid input: toggle complete all", () => {
    req.body = { listId: "list123", newCompletedState: "true" };

    const schema: ValidationSchema = [
      { field: "listId", type: "string" },
      { field: "newCompletedState", type: "boolean" },
    ];

    validateRequestBody(schema)(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: ["newCompletedState must be a boolean"],
    });
    expect(next).not.toHaveBeenCalled();
  });
});

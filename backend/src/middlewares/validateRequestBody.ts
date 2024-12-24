import { ValidationSchema } from "@src/validation";
import { Request, Response, NextFunction } from "express";

export const validateRequestBody = (schema: ValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: string[] = [];

    schema.forEach((rule) => {
      if (!req.body[rule.field]) {
        errors.push(`${rule.field} is required`);
        return;
      }

      const value = req.body[rule.field];

      if (value == undefined || value == null) {
        errors.push(`${rule.field} is required`);
        return;
      }

      if (rule.type === "string") {
        if (typeof value !== "string") {
          errors.push(`${rule.field} must be a string`);
        } else if (value?.trim() === "") {
          errors.push(`${rule.field} must not be empty`);
        }
      } else if (rule.type === "array") {
        if (!Array.isArray(value)) {
          errors.push(`${rule.field} must be an array`);
        } else if (value.length === 0) {
          errors.push(`${rule.field} must not be empty`);
        }
      } else if (rule.type === "boolean") {
        if (typeof value !== "boolean") {
          errors.push(`${rule.field} must be a boolean`);
        }
      }
    });

    if (errors.length) {
      res.status(400).json({ errors });
      return;
    }

    next();
  };
};

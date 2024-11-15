import { Express, Request } from "express-serve-static-core";

declare module "express" {
  export interface Request {
    userId?: string;
  }
}

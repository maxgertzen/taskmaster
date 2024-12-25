import { checkJwt, attachUser } from "@middlewares/authorisation";
import { Request, Response } from "express";
import { resolveUserId } from "@utils/resolveUserId";
import { envManager } from "@tests/helpers/envManager";

jest.mock("@utils/resolveUserId");
jest.mock("express-oauth2-jwt-bearer", () => ({
  auth: jest.fn(() => jest.fn()),
}));

describe("authorisation middlewares", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    jest.resetModules();
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe("mock mode", () => {
    beforeEach(() => {
      envManager.setEnv("mock");
    });
    describe("checkJwt", () => {
      it("should skip authentication in mock mode", () => {
        checkJwt(req as Request, res as Response, next);

        expect(next).toHaveBeenCalled();
      });
    });

    describe("attachUser", () => {
      it("should resolve and attach mock userId in mock mode", async () => {
        (resolveUserId as jest.Mock).mockResolvedValue("mockUserId");

        await attachUser(req as Request, res as Response, next);

        expect(req.userId).toBe("mockUserId");
        expect(next).toHaveBeenCalled();
      });
    });
  });

  describe("production mode", () => {
    beforeEach(() => {
      envManager.setEnv("prod");
    });

    describe("checkJwt", () => {
      it("should invoke JWT validation in production mode", () => {
        process.env.USE_MOCK = "false";

        checkJwt(req as Request, res as Response, next);

        expect(next).not.toHaveBeenCalledWith(expect.any(Error));
      });
    });

    describe("attachUser", () => {
      it("should handle unauthorized requests", async () => {
        req.auth = { payload: {} };

        await attachUser(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
      });

      it("should resolve and attach userId in production mode", async () => {
        req.auth = {
          payload: {
            sub: "auth0|123",
            email: "testing@user.com",
            name: "Test User",
          },
        };

        (resolveUserId as jest.Mock).mockResolvedValue(req.auth.payload.sub);

        await attachUser(req as Request, res as Response, next);
        expect(req.userId).toBe(req.auth.payload.sub);
        expect(next).toHaveBeenCalled();
      });
    });
  });
});

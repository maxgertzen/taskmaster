import { Request, Response, NextFunction } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import { resolveUserId } from "../utils/resolveUserId";
import { UnauthorizedError } from "@src/errors";

interface AuthConfig {
  audience: string;
  issuerBaseURL: string;
  isDisabled: boolean;
  mockUserId?: string;
}

const authConfig: AuthConfig = {
  audience: process.env.AUTH0_AUDIENCE!,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL!,
  isDisabled: process.env.IS_AUTH0_DISABLED === "true",
  mockUserId:
    process.env.IS_AUTH0_DISABLED === "true"
      ? process.env.MOCK_USER_ID
      : undefined,
};

class AuthMiddleware {
  private authValidator: ReturnType<typeof auth>;

  constructor(private config: AuthConfig) {
    this.authValidator = auth({
      audience: this.config.audience,
      issuerBaseURL: this.config.issuerBaseURL,
    });
  }

  validateToken = (req: Request, res: Response, next: NextFunction) => {
    if (this.config.isDisabled) {
      if (this.config.mockUserId === req.headers.authorization) {
        req.userId = this.config.mockUserId;
        next();
        return;
      }
      throw new UnauthorizedError("Unauthorized");
    }

    return this.authValidator(req, res, next);
  };

  resolveUser = async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (this.config.isDisabled) {
        const userId = await this.resolveMockUser();
        req.userId = userId;
        return next();
      }

      const auth = req.auth?.payload;

      if (!auth?.sub) {
        throw new UnauthorizedError("Missing user identifier");
      }

      req.userId = await resolveUserId(
        auth.sub,
        auth.email as string | undefined,
        auth.name as string | undefined
      );

      next();
    } catch (error) {
      next(error);
    }
  };

  private async resolveMockUser(): Promise<string> {
    if (!this.config.mockUserId) {
      throw new Error("Mock user ID not configured");
    }
    return resolveUserId(this.config.mockUserId);
  }
}

export const authMiddleware = new AuthMiddleware(authConfig);

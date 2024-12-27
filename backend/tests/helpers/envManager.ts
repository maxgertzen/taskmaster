import { DBType } from "@src/types/constants";

const mockEnvironmentVariables = {
  NODE_ENV: "development" as const,
  DB_TYPE: "mongo" as DBType,
  PORT: "3000",
  REDIS_PORT: "6379",
  REDIS_PASSWORD: "",
  REDIS_HOST: "redis",
  LOCAL_DEV_CLIENT_URL: "http://localhost:3001",
  MONGODB_URI: "mongodb://localhost:27017/taskmaster",
  AUTH0_ISSUER_BASE_URL: "https://dummy-auth0-issuer.com",
  AUTH0_AUDIENCE: "https://dummy-audience.com",
  USE_MOCK: "true" as const,
};

const prodEnvironmentVariables = {
  ...mockEnvironmentVariables,
  USE_MOCK: "false" as const,
};

class EnvManager {
  private originalEnv: NodeJS.ProcessEnv;

  constructor() {
    this.originalEnv = { ...process.env };
  }

  public setEnv(env: "mock" | "prod") {
    process.env = {
      ...(env === "mock" ? mockEnvironmentVariables : prodEnvironmentVariables),
    };
  }

  public resetEnv() {
    process.env = { ...this.originalEnv };
  }
}

const envManager = new EnvManager();

export { envManager };

import { DBType } from "./constants";

declare global {
  declare namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      REDIS_HOST: string;
      REDIS_PORT: string;
      REDIS_PASSWORD: string;
      LOCAL_DEV_CLIENT_URL: string;
      AUTH0_ISSUER_BASE_URL: string;
      AUTH0_AUDIENCE: string;
      NODE_ENV: "development" | "production" | "test";
      MOCK_USER_ID: string;
      IS_AUTH0_DISABLED: "true" | "false";
      MONGODB_URI: string;
      DB_TYPE: DBType;
    }
  }
}

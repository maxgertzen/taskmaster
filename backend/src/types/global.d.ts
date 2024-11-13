declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_PASSWORD: string;
    LOCAL_DEV_CLIENT_URL: string;
    NODE_ENV: "development" | "production" | "test";
  }
}

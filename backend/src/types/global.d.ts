declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_PASSWORD: string;
    NODE_ENV: "development" | "production" | "test";
  }
}

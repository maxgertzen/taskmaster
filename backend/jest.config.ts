import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@src/(.*)$": "<rootDir>/src/$1",
    "^@config/(.*)$": "<rootDir>/src/config/$1",
    "^@controllers/(.*)$": "<rootDir>/src/controllers/$1",
    "^@services/(.*)$": "<rootDir>/src/services/$1",
    "^@models/(.*)$": "<rootDir>/src/models/$1",
    "^@middlewares/(.*)$": "<rootDir>/src/middlewares/$1",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@types/(.*)$": "<rootDir>/src/types/$1",
    "^@interfaces/(.*)$": "<rootDir>/src/interfaces/$1",
    "^@repositories/(.*)$": "<rootDir>/src/repositories/$1",
    "^@tests/(.*)$": "<rootDir>/tests/$1",
  },
  testPathIgnorePatterns: ["/node_modules/(?!(nanoid)/)", "/dist/"],
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  setupFilesAfterEnv: ["./tests/setup/jest.setup.ts"],
};

export default config;

import type { Config } from "jest";

const baseConfig: Config = {
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
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  extensionsToTreatAsEsm: [".ts"],
};

const config: Config = {
  projects: [
    {
      displayName: "unit",
      ...baseConfig,
      testMatch: ["<rootDir>/tests/unit/**/*.test.ts"],
      setupFilesAfterEnv: ["<rootDir>/tests/setup/jest.unit.setup.ts"],
    },
    {
      displayName: "integration",
      ...baseConfig,
      testMatch: ["<rootDir>/tests/integration/**/*.test.ts"],
      setupFilesAfterEnv: ["<rootDir>/tests/setup/jest.integration.setup.ts"],
    },
  ],
};

export default config;

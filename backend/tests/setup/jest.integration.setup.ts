import { envManager } from "@tests/helpers/envManager";
import {
  setupTestDatabase,
  teardownTestDatabase,
  clearTestDatabase,
} from "@tests/integration/setup/database";
import {
  setupTestServer,
  teardownTestServer,
} from "@tests/integration/setup/testServer";

beforeAll(async () => {
  await setupTestDatabase();
  await setupTestServer();
});

afterAll(async () => {
  await teardownTestDatabase();
  await teardownTestServer();
});

beforeEach(() => {});

afterEach(async () => {
  envManager.resetEnv();
  await clearTestDatabase();
});

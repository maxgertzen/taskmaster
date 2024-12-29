import { envManager } from "@tests/helpers/envManager";
import {
  clearTestData,
  setupTestEnvironment,
  teardownTestEnvironment,
  // teardownTestEnvironment,
} from "@tests/integration/setup/testSetup";

global.testDbType = process.env.DB_TYPE || "mongo";

beforeAll(async () => {
  try {
    envManager.setEnv("mock");
    const testEnv = await setupTestEnvironment(global.testDbType);
    global.testContainer = testEnv.container;

    console.log("Test Environment setup completed");
  } catch (error) {
    console.error("Failed to setup test environment:", error);
    throw error;
  }
}, 30000);

afterAll(async () => {
  try {
    await teardownTestEnvironment();
    console.log("Test Environment teardown completed");
  } catch (error) {
    console.error("Failed to teardown test environment:", error);
    throw error;
  }
}, 30000);

beforeEach(async () => {
  try {
    await clearTestData();
  } catch (error) {
    console.error("Failed to setup test data:", error);
    throw error;
  }
}, 30000);

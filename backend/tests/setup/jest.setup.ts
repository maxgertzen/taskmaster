import { envManager } from "@tests/helpers/envManager";
import "@tests/helpers/cacheServiceMock";

beforeAll(async () => {});

afterAll(async () => {});

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(async () => {
  envManager.resetEnv();
  jest.resetModules();
});

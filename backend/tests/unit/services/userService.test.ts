import { userFactory } from "@tests/data";
import { ServiceTestContext } from "@tests/types/serviceTypes";
import { setupServiceTest } from "@tests/helpers/serviceTestUtils";

describe("UsersService", () => {
  let testContext: ServiceTestContext<"users">;

  beforeEach(() => {
    testContext = setupServiceTest("users");
  });

  afterEach(() => {
    testContext.container.dispose();
  });

  it("should retrieve a user by ID", async () => {
    const mockUser = userFactory.generateBaseUser({ auth0Id: "1" });
    testContext.repository.getUser.mockResolvedValue(mockUser);

    const result = await testContext.service.getOrCreateUser(mockUser.auth0Id);
    expect(result).toEqual(mockUser);
    expect(testContext.repository.getUser).toHaveBeenCalledWith(
      mockUser.auth0Id
    );
  });

  it("should throw an error if user ID is invalid", async () => {
    await expect(testContext.service.getOrCreateUser("")).rejects.toThrow(
      "Invalid user ID"
    );
  });

  it("should create a new user", async () => {
    const newUser = userFactory.generateBaseUser({
      name: "Jane Doe",
      auth0Id: "auth0|2",
      email: "janedoe@example.com",
    });
    testContext.repository.createUser.mockResolvedValue(newUser);

    const result = await testContext.service.getOrCreateUser(
      newUser.auth0Id,
      newUser.email,
      newUser.name
    );
    expect(result).toEqual(newUser);
    expect(testContext.repository.createUser).toHaveBeenCalledWith(
      newUser.auth0Id,
      newUser.email,
      newUser.name
    );
  });

  it("should throw an error if name is missing during user creation", async () => {
    await expect(testContext.service.getOrCreateUser("")).rejects.toThrow(
      "Invalid user ID"
    );
  });
});

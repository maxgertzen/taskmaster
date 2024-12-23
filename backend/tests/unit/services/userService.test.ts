import { UserService } from "@services/userService";
import { IUserRepository } from "@interfaces/userRepository";
import { userFactory } from "@tests/data";

describe("UserService", () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      getUser: jest.fn(),
      createUser: jest.fn(),
      updateUser: jest.fn(),
      updatePreferences: jest.fn(),
    };
    userService = new UserService(mockUserRepository);
  });

  it("should retrieve a user by ID", async () => {
    const mockUser = userFactory.generateBaseUser({ auth0Id: "1" });
    mockUserRepository.getUser.mockResolvedValue(mockUser);

    const result = await userService.getOrCreateUser(mockUser.auth0Id);
    expect(result).toEqual(mockUser);
    expect(mockUserRepository.getUser).toHaveBeenCalledWith(mockUser.auth0Id);
  });

  it("should throw an error if user ID is invalid", async () => {
    await expect(userService.getOrCreateUser("")).rejects.toThrow(
      "Invalid user ID"
    );
  });

  it("should create a new user", async () => {
    const newUser = userFactory.generateBaseUser({
      name: "Jane Doe",
      auth0Id: "auth0|2",
      email: "janedoe@example.com",
    });
    mockUserRepository.createUser.mockResolvedValue(newUser);

    const result = await userService.getOrCreateUser(
      newUser.auth0Id,
      newUser.email,
      newUser.name
    );
    expect(result).toEqual(newUser);
    expect(mockUserRepository.createUser).toHaveBeenCalledWith(
      newUser.auth0Id,
      newUser.email,
      newUser.name
    );
  });

  it("should throw an error if name is missing during user creation", async () => {
    await expect(userService.getOrCreateUser("")).rejects.toThrow(
      "Invalid user ID"
    );
  });
});

import { resolveUserId } from "@src/utils/resolveUserId";
import { BaseUser } from "@src/interfaces/entities";
import { utilTestConfigs } from "@tests/data/utils";

const { validInputs, mockResponses, errors } = utilTestConfigs;

jest.mock("@src/container", () => ({
  getAppContainer: jest.fn(() => ({
    cradle: {
      usersService: mockUsersService,
    },
  })),
}));

const mockUsersService = {
  getOrCreateUser: jest.fn(),
};

describe("resolveUserId", () => {
  beforeEach(() => {
    mockUsersService.getOrCreateUser.mockClear();
  });

  it("should return _id when user object contains _id", async () => {
    mockUsersService.getOrCreateUser.mockResolvedValue(
      mockResponses.user.withId
    );

    const result = await resolveUserId(
      validInputs.auth0Id,
      validInputs.email,
      validInputs.name
    );

    expect(result).toBe(mockResponses.user.withId._id);
    expect(mockUsersService.getOrCreateUser).toHaveBeenCalledWith(
      validInputs.auth0Id,
      validInputs.email,
      validInputs.name
    );
  });

  it("should return auth0Id when user object doesn't contain _id", async () => {
    mockUsersService.getOrCreateUser.mockResolvedValue(
      mockResponses.user.withoutId as BaseUser
    );

    const result = await resolveUserId(validInputs.auth0Id);

    expect(result).toBe(validInputs.auth0Id);
    expect(mockUsersService.getOrCreateUser).toHaveBeenCalledWith(
      validInputs.auth0Id,
      undefined,
      undefined
    );
  });

  it("should handle undefined _id", async () => {
    mockUsersService.getOrCreateUser.mockResolvedValue(
      mockResponses.user.withUndefinedId as unknown as BaseUser
    );

    const result = await resolveUserId(validInputs.auth0Id);

    expect(result).toBe("");
  });

  it("should throw error when user is not found", async () => {
    mockUsersService.getOrCreateUser.mockResolvedValue(null);

    await expect(resolveUserId(validInputs.auth0Id)).rejects.toThrow(
      errors.userNotFound
    );
  });

  it("should handle optional email and name parameters", async () => {
    mockUsersService.getOrCreateUser.mockResolvedValue(
      mockResponses.user.withId
    );

    await resolveUserId(validInputs.auth0Id);
    expect(mockUsersService.getOrCreateUser).toHaveBeenCalledWith(
      validInputs.auth0Id,
      undefined,
      undefined
    );

    await resolveUserId(validInputs.auth0Id, validInputs.email);
    expect(mockUsersService.getOrCreateUser).toHaveBeenCalledWith(
      validInputs.auth0Id,
      validInputs.email,
      undefined
    );
  });

  it("should properly propagate service errors", async () => {
    mockUsersService.getOrCreateUser.mockRejectedValue(
      new Error(errors.serviceError)
    );

    await expect(resolveUserId(validInputs.auth0Id)).rejects.toThrow(
      errors.serviceError
    );
  });
});

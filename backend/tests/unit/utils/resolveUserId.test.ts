import { resolveUserId } from "@src/utils/resolveUserId";
import { getUserService } from "@src/services";
import { utilTestConfigs } from "@tests/data/utils";

const { validInputs, mockResponses, errors } = utilTestConfigs;

jest.mock("@src/services", () => ({
  getUserService: jest.fn(),
}));

describe("resolveUserId", () => {
  const mockGetOrCreateUser = jest.fn();
  const mockGetUserService = getUserService as jest.Mock;

  beforeEach(() => {
    mockGetUserService.mockReturnValue({
      getOrCreateUser: mockGetOrCreateUser,
    });
  });

  it("should return _id when user object contains _id", async () => {
    mockGetOrCreateUser.mockResolvedValue(mockResponses.user.withId);

    const result = await resolveUserId(
      validInputs.auth0Id,
      validInputs.email,
      validInputs.name
    );

    expect(result).toBe(mockResponses.user.withId._id);
    expect(mockGetOrCreateUser).toHaveBeenCalledWith(
      validInputs.auth0Id,
      validInputs.email,
      validInputs.name
    );
  });

  it("should return auth0Id when user object doesn't contain _id", async () => {
    mockGetOrCreateUser.mockResolvedValue(mockResponses.user.withoutId);

    const result = await resolveUserId(validInputs.auth0Id);
    expect(result).toBe(validInputs.auth0Id);
    expect(mockGetOrCreateUser).toHaveBeenCalledWith(
      validInputs.auth0Id,
      undefined,
      undefined
    );
  });

  it("should handle undefined _id", async () => {
    mockGetOrCreateUser.mockResolvedValue(mockResponses.user.withUndefinedId);

    const result = await resolveUserId(validInputs.auth0Id);
    expect(result).toBe("");
  });

  it("should throw error when user is not found", async () => {
    mockGetOrCreateUser.mockResolvedValue(null);

    await expect(resolveUserId(validInputs.auth0Id)).rejects.toThrow(
      errors.userNotFound
    );
  });

  it("should handle optional email and name parameters", async () => {
    mockGetOrCreateUser.mockResolvedValue(mockResponses.user.withId);

    await resolveUserId(validInputs.auth0Id);
    expect(mockGetOrCreateUser).toHaveBeenCalledWith(
      validInputs.auth0Id,
      undefined,
      undefined
    );

    await resolveUserId(validInputs.auth0Id, validInputs.email);
    expect(mockGetOrCreateUser).toHaveBeenCalledWith(
      validInputs.auth0Id,
      validInputs.email,
      undefined
    );
  });

  it("should properly propagate service errors", async () => {
    mockGetOrCreateUser.mockRejectedValue(new Error(errors.serviceError));

    await expect(resolveUserId(validInputs.auth0Id)).rejects.toThrow(
      errors.serviceError
    );
  });
});

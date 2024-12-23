import { BaseUser } from "@interfaces/entities";

export const userFactory = {
  generateBaseUser: (overrides: Partial<BaseUser> = {}): BaseUser => ({
    auth0Id: "auth0|123456",
    email: "test@example.com",
    name: "Test User",
    preferences: {},
    ...overrides,
  }),

  generateMongoUser: (overrides: Partial<BaseUser> = {}): any => ({
    _id: "mocked-mongo-id",
    auth0Id: "auth0|123456",
    email: "test@example.com",
    name: "Test User",
    preferences: {},
    ...overrides,
  }),
};

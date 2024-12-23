import type { TestConfig } from "@tests/types/utils";

export const testConfig: TestConfig = {
  validInputs: {
    userId: "user123",
    taskId: "task456",
    listId: "list789",
    query: "searchQuery",
    auth0Id: "auth0|123456",
    email: "test@example.com",
    name: "Test User",
  },
  edgeCases: {
    emptyStrings: {
      userId: "",
      taskId: "",
      listId: "",
      auth0Id: "",
    },
    specialChars: {
      userId: "user@123!",
      taskId: "task#456$",
      listId: "list#789$",
      auth0Id: "auth0|special!@#",
    },
  },
  mockResponses: {
    nanoid: {
      default: "mocked-nanoid",
      sequence: ["id1", "id2", "id3"],
    },
    user: {
      withId: {
        _id: "user123",
        auth0Id: "auth0|123456",
      },
      withoutId: {
        auth0Id: "auth0|123456",
      },
      withUndefinedId: {
        _id: undefined,
        auth0Id: "auth0|123456",
      },
    },
  },
  errors: {
    userNotFound: "User with auth0Id auth0|123456 not found",
    serviceError: "Service error",
    importError: "Failed to import nanoid",
  },
};

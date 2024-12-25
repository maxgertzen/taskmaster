import { CACHE_KEYS } from "@src/utils/cacheKeys";

export type CacheKey = keyof typeof CACHE_KEYS;

export interface TestConfig {
  validInputs: {
    userId: string;
    taskId: string;
    listId: string;
    query: string;
    auth0Id: string;
    email: string;
    name: string;
  };
  edgeCases: {
    emptyStrings: {
      userId: string;
      taskId: string;
      listId: string;
      auth0Id: string;
    };
    specialChars: {
      userId: string;
      taskId: string;
      listId: string;
      auth0Id: string;
    };
  };
  mockResponses: {
    nanoid: {
      default: string;
      sequence: string[];
    };
    user: {
      withId: {
        _id: string;
        auth0Id: string;
      };
      withoutId: {
        auth0Id: string;
      };
      withUndefinedId: {
        _id: undefined;
        auth0Id: string;
      };
    };
  };
  errors: {
    userNotFound: string;
    serviceError: string;
    importError: string;
  };
}

import { BaseList } from "@interfaces/entities";

export const listFactory = {
  generateBaseList: (overrides: Partial<BaseList> = {}): BaseList => ({
    id: "list123",
    creationDate: new Date().toISOString(),
    userId: "user123",
    orderIndex: 0,
    name: "Sample List",
    sharedWith: ["user456", "user789"],
    ...overrides,
  }),

  generateMongoList: (overrides: Partial<BaseList> = {}): any => ({
    _id: "mocked-mongo-id",
    name: "Sample List",
    creationDate: new Date(),
    userId: "mocked-user-id",
    sharedWith: ["mocked-user-id-2"],
    orderIndex: 0,
    ...overrides,
  }),
};

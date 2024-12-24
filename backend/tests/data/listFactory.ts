import { BaseList } from "@interfaces/entities";
import { ListModel, MongoList } from "@src/models/list";
import mongoose from "mongoose";

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

  generateMongoList: (
    overrides: Partial<BaseList & { _id: mongoose.Types.ObjectId }> = {}
  ): MongoList =>
    new ListModel({
      name: "Sample List",
      userId: new mongoose.Types.ObjectId(),
      orderIndex: 0,
      ...overrides,
    }),
};

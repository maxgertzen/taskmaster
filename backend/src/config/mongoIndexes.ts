import { ListModel } from "../models/list";
import { TaskModel } from "../models/task";
import { UserModel } from "../models/user";

export async function createMongoIndexes(): Promise<void> {
  try {
    await UserModel.collection.createIndexes([
      { key: { auth0Id: 1 }, unique: true },
      { key: { email: 1 } },
    ]);

    await ListModel.collection.createIndexes([
      { key: { userId: 1, orderIndex: 1 } },
      { key: { userId: 1, name: 1 } },
    ]);

    await TaskModel.collection.createIndexes([
      { key: { userId: 1, listId: 1, orderIndex: 1 } },
      { key: { text: "text" } },
      { key: { userId: 1, listId: 1, completed: 1 } },
    ]);

    console.log("MongoDB indexes created successfully");
  } catch (error) {
    console.error("Error creating MongoDB indexes:", error);
    throw error;
  }
}

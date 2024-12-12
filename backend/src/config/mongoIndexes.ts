import { ListModel } from "../models/list";
import { TaskModel } from "../models/task";
import { UserModel } from "../models/user";

export async function createMongoIndexes(): Promise<void> {
  try {
    await UserModel.syncIndexes();
    await ListModel.syncIndexes();
    await TaskModel.syncIndexes();
    console.log("MongoDB indexes created successfully");
  } catch (error) {
    console.error("Error creating MongoDB indexes:", error);
  }
}

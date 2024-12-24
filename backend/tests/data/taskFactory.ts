import { BaseTask, ClientTask } from "@interfaces/entities";
import { MongoTask, TaskModel } from "@src/models/task";
import mongoose from "mongoose";

export const taskFactory = {
  generateBaseTask: (overrides: Partial<BaseTask> = {}): BaseTask => ({
    id: "task123",
    creationDate: new Date().toISOString(),
    userId: "user123",
    orderIndex: 0,
    text: "Sample Task",
    completed: false,
    listId: "list123",
    ...overrides,
  }),

  generateMongoTask: (
    overrides: Partial<BaseTask & { _id: mongoose.Types.ObjectId }> = {}
  ): MongoTask =>
    new TaskModel({
      text: "Sample Task",
      creationDate: new Date(),
      userId: new mongoose.Types.ObjectId(),
      listId: new mongoose.Types.ObjectId(),
      orderIndex: 0,
      completed: false,
      ...overrides,
    }),

  generateClientTask: (overrides: Partial<ClientTask> = {}): ClientTask => {
    const baseTask = taskFactory.generateBaseTask(overrides);
    return {
      ...baseTask,
      completed: !!baseTask.completed,
    };
  },
};

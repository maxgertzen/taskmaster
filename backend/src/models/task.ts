import mongoose, { Schema, Document } from "mongoose";
import { BaseTask } from "../interfaces/entities";

export interface MongoTask
  extends Omit<BaseTask, "id" | "listId" | "userId">,
    Document {
  _id: mongoose.Types.ObjectId;
  completed: boolean;
  userId: mongoose.Types.ObjectId;
  listId: mongoose.Types.ObjectId;
}

const TaskSchema = new Schema<MongoTask>(
  {
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    creationDate: { type: Date, default: Date.now },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    listId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "List",
      index: true,
    },
    orderIndex: {
      type: Number,
      required: true,
      index: true,
    },
  },
  { strict: true }
);

TaskSchema.index({ userId: 1, text: 1 }, { background: true });
TaskSchema.index({ userId: 1, listId: 1, orderIndex: 1 }, { background: true });

export const TaskModel = mongoose.model<MongoTask>("Task", TaskSchema);

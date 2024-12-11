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
    },
    listId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "List",
    },
    orderIndex: {
      type: Number,
      required: true,
    },
  },
  { strict: true }
);

export const TaskModel = mongoose.model<MongoTask>("Task", TaskSchema);

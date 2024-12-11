import mongoose, { Schema, Document } from "mongoose";
import { BaseList } from "../interfaces/entities";

export interface MongoList
  extends Omit<BaseList, "id" | "sharedWith" | "userId">,
    Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  sharedWith?: mongoose.Types.ObjectId[];
}

const ListSchema = new Schema<MongoList>({
  name: { type: String, required: true },
  creationDate: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

export const ListModel = mongoose.model<MongoList>("List", ListSchema);

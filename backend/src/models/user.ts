import mongoose, { Schema, Document } from "mongoose";
import { BaseUser } from "../interfaces/entities";
export interface MongoUser extends Omit<BaseUser, "id">, Document {
  _id: mongoose.Types.ObjectId;
}

const UserSchema = new Schema<MongoUser>({
  auth0Id: { type: String, required: true, unique: true, index: true },
  email: { type: String, trim: true, lowercase: true, index: true },
  name: { type: String },
  preferences: { type: Schema.Types.Mixed },
});

export const UserModel = mongoose.model<MongoUser>("User", UserSchema);

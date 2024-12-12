import mongoose, { Schema, Document } from "mongoose";
import { BaseUser } from "../interfaces/entities";
export interface MongoUser extends BaseUser, Document {
  _id: mongoose.Types.ObjectId;
}

const UserSchema = new Schema<MongoUser>({
  auth0Id: { type: String, required: true, unique: true },
  email: { type: String, trim: true, lowercase: true },
  name: { type: String },
  preferences: { type: Schema.Types.Mixed },
});

export const UserModel = mongoose.model<MongoUser>("User", UserSchema);

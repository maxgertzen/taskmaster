import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  auth0Id: string;
  email?: string;
  name?: string;
  preferences?: Record<string, unknown>;
}

const UserSchema = new Schema<IUser>({
  auth0Id: { type: String, required: true, unique: true },
  email: { type: String, trim: true, lowercase: true },
  name: { type: String },
  preferences: { type: Schema.Types.Mixed },
});

export const UserModel = mongoose.model<IUser>("User", UserSchema);

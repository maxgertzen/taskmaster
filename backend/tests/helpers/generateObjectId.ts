import mongoose from "mongoose";

export const generateObjectId = (): mongoose.Types.ObjectId => {
  return new mongoose.Types.ObjectId();
};

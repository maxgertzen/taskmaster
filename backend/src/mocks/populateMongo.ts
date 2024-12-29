import mongoose from "mongoose";
import { UserModel } from "../models/user";
import { ListModel } from "../models/list";
import { TaskModel } from "../models/task";
import { MOCK_USER_ID } from "./constants";
import { createMongoIndexes } from "../config/mongoIndexes";

const populateMongo = async () => {
  if (process.env.NODE_ENV === "production") {
    console.error("Error: populateMongo should not be run in production!");
    return;
  }

  if (process.env.DB_TYPE !== "mongo") {
    console.log("Skipping MongoDB population: DB_TYPE is not 'mongo'.");
    return;
  }

  if (process.env.IS_AUTH0_DISABLED !== "true") {
    console.log(
      "Skipping mock data population (IS_AUTH0_DISABLED is not true)."
    );
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      autoIndex: true,
    });

    await Promise.all([
      UserModel.deleteMany({}),
      ListModel.deleteMany({}),
      TaskModel.deleteMany({}),
    ]);

    await createMongoIndexes();

    const user = await UserModel.create({
      auth0Id: MOCK_USER_ID,
      email: "mock@example.com",
      name: "Mock User",
      preferences: {
        theme: "light",
        notifications: true,
      },
    });

    const lists = await ListModel.create([
      {
        name: "Mock List 1",
        userId: user._id,
        orderIndex: 0,
        creationDate: new Date(),
      },
      {
        name: "Mock List 2",
        userId: user._id,
        orderIndex: 1,
        creationDate: new Date(),
      },
    ]);

    await TaskModel.create([
      {
        text: "Mock Task 1",
        completed: false,
        userId: user._id,
        listId: lists[0]._id,
        orderIndex: 0,
        creationDate: new Date(),
      },
      {
        text: "Mock Task 2",
        completed: true,
        userId: user._id,
        listId: lists[0]._id,
        orderIndex: 1,
        creationDate: new Date(),
      },
      {
        text: "Mock Task 3",
        completed: false,
        userId: user._id,
        listId: lists[1]._id,
        orderIndex: 2,
        creationDate: new Date(),
      },
    ]);

    console.log("Mock data populated successfully");
  } catch (err) {
    console.error("Error populating MongoDB:", err);
  } finally {
    await mongoose.connection.close();
    console.log("PopulateScript: MongoDB connection closed");
  }
};

populateMongo();

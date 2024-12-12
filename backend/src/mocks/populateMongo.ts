import mongoose from "mongoose";
import { UserModel } from "../models/user";
import { ListModel } from "../models/list";
import { TaskModel } from "../models/task";
import { MOCK_USER_ID } from "./constants";

const populateMongo = async () => {
  if (process.env.DB_TYPE !== "mongo") {
    console.log("Skipping MongoDB population: DB_TYPE is not 'mongo'.");
    process.exit(0);
  }

  if (process.env.USE_MOCK !== "true") {
    console.log("Skipping mock data population (USE_MOCK is not true).");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    await Promise.all([
      UserModel.deleteMany({}),
      ListModel.deleteMany({}),
      TaskModel.deleteMany({}),
    ]);

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
    process.exit(0);
  }
};

populateMongo();

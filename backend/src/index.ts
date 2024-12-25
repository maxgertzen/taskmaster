import dotenv from "dotenv";
dotenv.config();

import { initializeDatabase } from "./config/database";
import createApp from "./app";
import { initializeContainer } from "./container";

const PORT = process.env.PORT || 5000;

// TODO:
// 1. Update the redis implementation to use indexing and searching
const startServer = async () => {
  try {
    await initializeDatabase();
    await initializeContainer();
    const app = await createApp();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

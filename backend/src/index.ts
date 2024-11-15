import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { redisClient } from "./config";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

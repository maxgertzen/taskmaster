import express from "express";
import cors from "cors";
import { listRoutes } from "./routes/listRoutes";
import { taskRoutes } from "./routes/taskRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import { checkJwt, attachUser } from "./middlewares/authorisation";

const createApp = async () => {
  const app = express();

  if (process.env.MODE !== "production") {
    app.use(
      cors({
        origin: process.env.LOCAL_DEV_CLIENT_URL,
        credentials: true,
      })
    );
  }
  app.use(express.json());

  app.use("/api/lists", checkJwt, attachUser, listRoutes);
  app.use("/api/tasks", checkJwt, attachUser, taskRoutes);

  app.use(errorHandler);

  return app;
};

export default createApp;

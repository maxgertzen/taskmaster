import express from "express";
import cors from "cors";
import { configureListRoutes } from "./routes/listRoutes";
import { configureTaskRoutes } from "./routes/taskRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import { authMiddleware } from "./middlewares/authorisation";
import { AwilixContainer } from "awilix";
import { ContainerType } from "./types/container";

const createApp = async (container: AwilixContainer<ContainerType>) => {
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

  app.use(
    "/api/lists",
    authMiddleware.validateToken,
    authMiddleware.resolveUser,
    configureListRoutes(container)
  );
  app.use(
    "/api/tasks",
    authMiddleware.validateToken,
    authMiddleware.resolveUser,
    configureTaskRoutes(container)
  );

  app.use(errorHandler);

  return app;
};

export default createApp;

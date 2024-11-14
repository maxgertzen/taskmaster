import express from "express";
import cors from "cors";
import { listRoutes } from "./routes/listRoutes";
import { taskRoutes } from "./routes/taskRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import { checkJwt, attachUserId } from "./middlewares/authorisation";

const app = express();

app.use(
  cors({
    origin: process.env.LOCAL_DEV_CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());

// Route setup
app.use("/api/lists", checkJwt, attachUserId, listRoutes);
app.use("/api/tasks", checkJwt, attachUserId, taskRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;

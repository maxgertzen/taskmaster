import express from "express";
import { listRoutes } from "./routes/listRoutes";
import { taskRoutes } from "./routes/taskRoutes";
// import { authRoutes } from './routes/authRoutes';
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());

// Route setup
// app.use("/api/auth", authRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/tasks", taskRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;

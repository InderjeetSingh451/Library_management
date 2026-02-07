import express from "express";
import dotenv from "dotenv/config.js";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import feesRoutes from "./routes/feesRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import "./cron/autoAbsent.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/fees", feesRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

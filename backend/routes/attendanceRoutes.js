import express from "express";
import { markAttendance } from "../controllers/attendanceController.js";
import { protect } from "../middleware/authMiddleware.js";

const attendanceRoutes = express.Router();

attendanceRoutes.post("/mark", protect, markAttendance);

export default attendanceRoutes;

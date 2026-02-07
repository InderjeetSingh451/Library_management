import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";

const dashboardRoutes = express.Router();

dashboardRoutes.get("/", protect, getDashboardStats);

export default dashboardRoutes;

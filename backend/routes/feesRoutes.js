import express from "express";
import {
  getFeesDetails,
  updateFeesStatus,
} from "../controllers/feesController.js";
import { protect } from "../middleware/authMiddleware.js";

const feesRoutes = express.Router();

feesRoutes.get("/", protect, getFeesDetails);
feesRoutes.put("/:studentId", protect, updateFeesStatus);

export default feesRoutes;

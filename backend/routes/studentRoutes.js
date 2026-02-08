import express from "express";
import {
  addStudent,
  getStudents,
  getStudentById,
  deleteStudent,
  updateStudent,
} from "../controllers/studentController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const studentRoutes = express.Router();

studentRoutes
  .route("/")
  .post(protect, upload.single("image"), addStudent)
  .get(protect, getStudents);

studentRoutes
  .route("/:id")
  .get(protect, getStudentById)
  .put(protect, upload.single("image"), updateStudent)
  .delete(protect, deleteStudent);

export default studentRoutes;

import express from "express";
import {
  loginAdmin,
  signupAdmin,
  requestAdminOTP,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.post("/request-admin-otp", requestAdminOTP);
router.post("/signup", signupAdmin);

export default router;

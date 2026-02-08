import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { otpStore } from "../utils/otpStore.js";
import axios from "axios";

/* ================= TOKEN ================= */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

/* ================= OTP ================= */
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/* ================= SEND OTP VIA BREVO ================= */
const sendOTPViaEmail = async (otp) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Library Management",
          email: "faltukkaambhina@gmail.com", // MUST be verified
        },
        to: [
          {
            email: process.env.SUPER_ADMIN_EMAIL,
          },
        ],
        subject: "Admin Creation OTP",
        htmlContent: `
          <h2>Admin OTP Verification</h2>
          <p>Your OTP for creating a new admin is:</p>
          <h1 style="letter-spacing:4px">${otp}</h1>
          <p>This OTP is valid for 5 minutes.</p>
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    // console.log("📧 Brevo email sent:", response.data);
  } catch (error) {
    // console.error(
    //   "❌ Brevo email failed:",
    //   error.response?.data || error.message,
    // // );
    throw new Error("Failed to send OTP email");
  }
};

/* ================= REQUEST OTP ================= */
// POST /api/auth/request-admin-otp
export const requestAdminOTP = async (req, res, next) => {
  try {
    const superAdmin = await Admin.findOne({ role: "SUPER_ADMIN" });

    if (!superAdmin) {
      return res.status(500).json({ message: "Super Admin not found" });
    }

    const otp = generateOTP();

    otpStore.set("ADMIN_CREATE", {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    await sendOTPViaEmail(otp);

    res.json({ message: "OTP sent to Super Admin email" });
  } catch (err) {
    next(err);
  }
};

/* ================= SIGNUP ADMIN ================= */
// POST /api/auth/signup
export const signupAdmin = async (req, res, next) => {
  try {
    const { email, password, otp } = req.body;

    if (!email || !password || !otp) {
      return res.status(400).json({ message: "All fields required" });
    }

    const storedOTP = otpStore.get("ADMIN_CREATE");

    if (
      !storedOTP ||
      storedOTP.otp !== otp ||
      storedOTP.expiresAt < Date.now()
    ) {
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const admin = await Admin.create({
      email,
      password,
      role: "ADMIN",
    });

    otpStore.delete("ADMIN_CREATE");

    res.status(201).json({
      _id: admin._id,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id),
    });
  } catch (err) {
    next(err);
  }
};

/* ================= LOGIN ================= */
export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      _id: admin._id,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id),
    });
  } catch (err) {
    next(err);
  }
};

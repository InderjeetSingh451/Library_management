// scripts/createSuperAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";
import bcrypt from "bcrypt";
dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const exists = await Admin.findOne({ role: "SUPER_ADMIN" });

if (!exists) {
  const Hashpassword = await bcrypt.hash("library@library123", 10);
  await Admin.create({
    email: "itsforourfuture542@gmail.com",
    password: Hashpassword,
    role: "SUPER_ADMIN",
  });
  console.log("Super Admin created");
} else {
  console.log("Super Admin already exists");
}

process.exit();

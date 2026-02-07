import mongoose from "mongoose";

const feesSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["PAID", "UNPAID"],
      default: "UNPAID",
    },
  },
  { _id: false },
);

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    fatherName: {
      type: String,
      required: true,
    },
    libraryId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    category: {
      type: String,
      enum: ["GEN", "EWS", "OBC", "SC", "ST", "Other"],
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    image: {
      public_id: String,
      url: String,
    },
    monthlyFees: {
      type: Number,
      required: true,
    },
    feesHistory: [feesSchema],
    enrolledDate: {
      type: Date,
      default: Date.now,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Student", studentSchema);

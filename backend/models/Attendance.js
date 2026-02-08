// models/Attendance.js
import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["ENTRY", "EXIT"],
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
  },
  { _id: false },
);

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    date: {
      type: String, // YYYY-MM-DD (ENTRY date)
      required: true,
    },

    status: {
      type: String,
      enum: ["PRESENT", "ABSENT"],
      default: "PRESENT",
    },

    openSession: {
      type: Boolean,
      default: true, // ENTRY done, EXIT pending
    },

    logs: [activitySchema],
  },
  { timestamps: true },
);

attendanceSchema.index({ student: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);

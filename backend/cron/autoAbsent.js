// cron/autoAbsent.js
import cron from "node-cron";
import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";
import { getAttendanceDate } from "../utils/getAttendanceDate.js";

const DAY_START_TIME = process.env.DAY_START_TIME || "00:00";
const [HOUR, MINUTE] = DAY_START_TIME.split(":");

// Run cron exactly at your chosen time
cron.schedule(`${MINUTE} ${HOUR} * * *`, async () => {
  try {
    const today = getAttendanceDate();
    const students = await Student.find({ isDeleted: false });

    for (const student of students) {
      const alreadyExists = await Attendance.findOne({
        student: student._id,
        date: today,
      });

      if (alreadyExists) continue;

      // 🔥 Get last attendance
      const lastAttendance = await Attendance.findOne({
        student: student._id,
      }).sort({ createdAt: -1 });

      /**
       * REAL LOGIC:
       * - If last session is OPEN → student inside → PRESENT
       * - Else → ABSENT
       */
      if (lastAttendance && lastAttendance.openSession === true) {
        await Attendance.create({
          student: student._id,
          date: today,
          status: "PRESENT",
          openSession: true,
          logs: [],
        });
      } else {
        await Attendance.create({
          student: student._id,
          date: today,
          status: "ABSENT",
          openSession: false,
          logs: [],
        });
      }
    }

    console.log(`✅ Auto attendance processed for ${today}`);
  } catch (err) {
    console.error("❌ Auto-absent error:", err.message);
  }
});

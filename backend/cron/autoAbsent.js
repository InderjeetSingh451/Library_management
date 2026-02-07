import cron from "node-cron";
import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";

cron.schedule("59 23 * * *", async () => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const students = await Student.find({ isDeleted: false });

    for (const student of students) {
      const alreadyMarked = await Attendance.findOne({
        student: student._id,
        date: today,
      });

      if (!alreadyMarked) {
        await Attendance.create({
          student: student._id,
          date: today,
          status: "ABSENT",
          logs: [],
        });
      }
    }

    console.log("Auto-absent marked for", today);
  } catch (error) {
    console.error("Auto-absent error:", error.message);
  }
});

import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";

/**
 * @desc    Mark Attendance (ENTRY / EXIT toggle)
 * @route   POST /api/attendance/mark
 */
export const markAttendance = async (req, res, next) => {
  try {
    const { libraryId } = req.body;

    if (!libraryId) {
      res.status(400);
      throw new Error("Library ID is required");
    }

    const student = await Student.findOne({
      libraryId,
      isDeleted: false,
    });

    if (!student) {
      res.status(404);
      throw new Error("Invalid Library ID");
    }

    const today = new Date().toISOString().split("T")[0];
    const now = new Date();

    let attendance = await Attendance.findOne({
      student: student._id,
      date: today,
    });

    // 🔥 FIRST ENTRY (ABSENT → PRESENT)
    if (!attendance || attendance.status === "ABSENT") {
      if (!attendance) {
        attendance = new Attendance({
          student: student._id,
          date: today,
        });
      }

      attendance.status = "PRESENT";
      attendance.logs = [{ type: "ENTRY", time: now }];
      await attendance.save();

      return res.json({
        message: "Entry marked",
        type: "ENTRY",
        time: now,
      });
    }

    // 🔁 ENTRY ↔ EXIT toggle
    const lastLog = attendance.logs[attendance.logs.length - 1];
    const nextType = lastLog.type === "ENTRY" ? "EXIT" : "ENTRY";

    attendance.logs.push({
      type: nextType,
      time: now,
    });

    await attendance.save();

    res.json({
      message: `${nextType} marked`,
      type: nextType,
      time: now,
    });
  } catch (error) {
    next(error);
  }
};

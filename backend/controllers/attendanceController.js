// controllers/attendanceController.js
import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";

const getLocalDate = (date = new Date()) => date.toLocaleDateString("en-CA"); // YYYY-MM-DD (IST safe)

/**
 * POST /api/attendance/mark
 */
export const markAttendance = async (req, res, next) => {
  try {
    const { libraryId } = req.body;
    if (!libraryId) {
      return res.status(400).json({ message: "Library ID required" });
    }

    const student = await Student.findOne({
      libraryId,
      isDeleted: false,
    });

    if (!student) {
      return res.status(404).json({ message: "Invalid Library ID" });
    }

    const now = new Date();
    const today = getLocalDate(now);

    // 🔍 Find last attendance record (latest activity)
    const lastAttendance = await Attendance.findOne({
      student: student._id,
    }).sort({ createdAt: -1 });

    // ================= ENTRY =================
    // Allowed only if:
    // - No previous attendance
    // - OR last attendance session is CLOSED
    if (!lastAttendance || lastAttendance.openSession === false) {
      const attendance = await Attendance.create({
        student: student._id,
        date: today, // ENTRY date
        status: "PRESENT",
        openSession: true,
        logs: [{ type: "ENTRY", time: now }],
      });

      return res.json({
        message: "Entry marked",
        type: "ENTRY",
        time: now,
      });
    }

    // ================= EXIT =================
    // Allowed only if last session is OPEN
    lastAttendance.logs.push({
      type: "EXIT",
      time: now,
    });

    lastAttendance.openSession = false;
    await lastAttendance.save();

    return res.json({
      message: "Exit marked",
      type: "EXIT",
      time: now,
    });
  } catch (error) {
    next(error);
  }
};

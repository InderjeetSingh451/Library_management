// controllers/attendanceController.js
import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";
import { getAttendanceDate } from "../utils/getAttendanceDate.js";

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

    const today = getAttendanceDate();
    const now = new Date();

    let attendance = await Attendance.findOne({
      student: student._id,
      date: today,
    });

    // ENTRY
    if (!attendance || attendance.openSession === false) {
      if (!attendance) {
        attendance = await Attendance.create({
          student: student._id,
          date: today,
          status: "PRESENT",
          openSession: true,
          logs: [],
        });
      } else {
        attendance.openSession = true;
        attendance.status = "PRESENT";
      }

      attendance.logs.push({ type: "ENTRY", time: now });
      await attendance.save();

      return res.json({ type: "ENTRY", time: now ,name: student.name});
    }

    // EXIT
    attendance.logs.push({ type: "EXIT", time: now });
    attendance.openSession = false;
    await attendance.save();

    return res.json({ type: "EXIT", time: now,name: student.name });
  } catch (err) {
    next(err);
  }
};


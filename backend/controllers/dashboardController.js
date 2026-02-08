import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js";
import { getAttendanceDate } from "../utils/getAttendanceDate.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const today = getAttendanceDate();

    // last 7 attendance days (based on attendance DATE, not createdAt)
    const last7DaysDate = getAttendanceDate(
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    );

    // 1️⃣ Total students (non-deleted)
    const students = await Student.find({ isDeleted: false }).select("_id");
    const totalStudents = students.length;

    const studentIdSet = new Set(students.map((s) => s._id.toString()));

    // 2️⃣ Active students = at least 1 PRESENT in last 7 days
    const activeStudentIds = await Attendance.distinct("student", {
      status: "PRESENT",
      date: { $gte: last7DaysDate },
    });

    // only count non-deleted students
    const activeSet = new Set(
      activeStudentIds.map(String).filter((id) => studentIdSet.has(id)),
    );

    // 3️⃣ Today's attendance
    const todayAttendance = await Attendance.find({ date: today });

    let presentToday = 0;
    let absentToday = 0;

    for (const att of todayAttendance) {
      const studentId = att.student.toString();

      // only ACTIVE students are counted
      if (!activeSet.has(studentId)) continue;

      if (att.status === "PRESENT") presentToday++;
      if (att.status === "ABSENT") absentToday++;
    }

    res.json({
      totalStudents,
      activeStudents: activeSet.size,
      presentToday,
      absentToday,
      currentDate: today,
      currentTime: new Date().toLocaleTimeString(),
    });
  } catch (error) {
    next(error);
  }
};

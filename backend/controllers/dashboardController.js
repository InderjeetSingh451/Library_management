import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    // ✅ only non-deleted students
    const students = await Student.find({ isDeleted: false }, { _id: 1 });

    const studentIdSet = new Set(students.map((s) => s._id.toString()));
    const totalStudents = students.length;

    const today = new Date().toISOString().split("T")[0];
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // today attendance
    const todayAttendance = await Attendance.find({ date: today });

    // ✅ count only non-deleted students
    const presentToday = todayAttendance.filter(
      (a) => a.status === "PRESENT" && studentIdSet.has(a.student.toString()),
    ).length;

    const absentToday = todayAttendance.filter(
      (a) => a.status === "ABSENT" && studentIdSet.has(a.student.toString()),
    ).length;

    // active students (last 7 days + non-deleted)
    const activeStudentIds = await Attendance.distinct("student", {
      createdAt: { $gte: last7Days },
    });

    const activeStudents = await Student.find({
      _id: { $in: activeStudentIds },
      isDeleted: false,
    }).select("_id");

    // ❗ response format unchanged
    res.json({
      totalStudents,
      activeStudents: activeStudents.length,
      presentToday,
      absentToday,
      currentDate: today,
      currentTime: new Date().toLocaleTimeString(),
    });
  } catch (error) {
    next(error);
  }
};

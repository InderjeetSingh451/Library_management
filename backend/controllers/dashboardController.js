import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const totalStudents = await Student.countDocuments({});

    const today = new Date().toISOString().split("T")[0];
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const todayAttendance = await Attendance.find({ date: today });

    const presentToday = todayAttendance.filter(
      (a) => a.status === "PRESENT",
    ).length;

    const absentToday = todayAttendance.filter(
      (a) => a.status === "ABSENT",
    ).length;

    const activeStudents = await Attendance.distinct("student", {
      createdAt: { $gte: last7Days },
    });

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


import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { authAxios } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await authAxios.get("/api/dashboard");
      setStats(data);
    };

    fetchStats();
    const statsInterval = setInterval(fetchStats, 10000);
    const clockInterval = setInterval(() => setTime(new Date()), 1000);

    return () => {
      clearInterval(statsInterval);
      clearInterval(clockInterval);
    };
  }, []);

  if (!stats) return null;

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Dr. Bhim Rao Ambedkar Pustakalaya
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of your library system
          </p>
        </div>

        <div className="rounded-2xl bg-white px-6 py-4 shadow-sm ring-1 ring-gray-200">
          <p className="text-xs text-gray-500">{time.toLocaleDateString()}</p>
          <p className="text-2xl font-semibold text-gray-800">
            {time.toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          color="from-indigo-500 to-violet-500"
        />
        <StatCard
          title="Active Students"
          value={stats.activeStudents}
          color="from-emerald-500 to-green-500"
        />
        <StatCard
          title="Present Today"
          value={stats.presentToday}
          color="from-sky-500 to-cyan-500"
        />
        <StatCard
          title="Absent Today"
          value={stats.absentToday}
          color="from-rose-500 to-red-500"
        />
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Attendance */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
          <h2 className="mb-6 text-lg font-semibold text-gray-800">
            Attendance Overview
          </h2>

          <div className="space-y-5">
            <Progress
              label="Present"
              value={stats.presentToday}
              max={stats.totalStudents}
              color="bg-green-500"
            />
            <Progress
              label="Absent"
              value={stats.absentToday}
              max={stats.totalStudents}
              color="bg-red-500"
            />
            <Progress
              label="Active"
              value={stats.activeStudents}
              max={stats.totalStudents}
              color="bg-blue-500"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
          <h2 className="mb-6 text-lg font-semibold text-gray-800">
            Quick Actions
          </h2>

          <div className="space-y-3">
            <ActionButton onClick={() => navigate("/add-student")}>
              ➕ Add New Student
            </ActionButton>
            <ActionButton onClick={() => navigate("/attendance")}>
              🕘 Mark Attendance
            </ActionButton>
            <ActionButton onClick={() => navigate("/students")}>
              👨‍🎓 View Students
            </ActionButton>
            <ActionButton onClick={() => navigate("/fees")}>
              💳 Fees Details
            </ActionButton>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-12 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
        <h2 className="mb-6 text-lg font-semibold text-gray-800">
          System Summary
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <SummaryCard label="Total Records" value={stats.totalStudents} />
          <SummaryCard label="Active This Week" value={stats.activeStudents} />
          <SummaryCard
            label="Attendance Today"
            value={stats.presentToday + stats.absentToday}
          />
        </div>
      </div>
    </div>
  );
};

/* ---------------- Components ---------------- */

const StatCard = ({ title, value, color }) => (
  <div
    className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${color}
    p-6 text-white shadow-lg transition hover:-translate-y-1`}
  >
    <p className="text-sm opacity-90">{title}</p>
    <h2 className="mt-3 text-4xl font-bold">{value}</h2>
    <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
  </div>
);

const Progress = ({ label, value, max, color }) => {
  const percent = max ? Math.round((value / max) * 100) : 0;
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm text-gray-600">
        <span>{label}</span>
        <span>{percent}%</span>
      </div>
      <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden">
        <div
          className={`${color} h-3 rounded-full transition-all`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

const ActionButton = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="
      w-full rounded-xl border border-gray-200
      bg-gray-50 px-5 py-3 text-left text-sm font-medium
      transition-all
      hover:bg-gray-900 hover:text-white hover:shadow
      active:scale-[0.98]
    "
  >
    {children}
  </button>
);

const SummaryCard = ({ label, value }) => (
  <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
    <p className="text-sm text-gray-500">{label}</p>
    <h3 className="mt-2 text-3xl font-bold text-gray-800">{value}</h3>
  </div>
);

export default Dashboard;

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import {
  Users,
  UserCheck,
  UserMinus,
  Calendar,
  ArrowRight,
  TrendingUp,
  Clock,
  LayoutDashboard,
  ChevronRight,
} from "lucide-react";

const Dashboard = () => {
  const { authAxios } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await authAxios.get("/api/dashboard");
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
    const statsInterval = setInterval(fetchStats, 10000);
    const clockInterval = setInterval(() => setTime(new Date()), 1000);
    return () => {
      clearInterval(statsInterval);
      clearInterval(clockInterval);
    };
  }, [authAxios]);

  if (!stats) return <Loader />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 lg:p-12 text-slate-900">
      {/* Header Section */}
      <header className="mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm uppercase tracking-wider">
            <LayoutDashboard className="w-4 h-4" />
            Admin Dashboard
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl">
            Dr. Bhim Rao Ambedkar{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Pustakalaya
            </span>
          </h1>
          <p className="text-slate-500 font-medium">
            Monitoring library activity and student engagement.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white border border-slate-200/60 shadow-sm rounded-2xl px-6 py-4 backdrop-blur-md">
          <div className="bg-indigo-50 p-3 rounded-xl">
            <Clock className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
              {time.toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </p>
            <p className="text-2xl font-mono font-bold text-slate-800 tracking-tight">
              {time.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={Users}
          gradient="from-indigo-500 to-indigo-700"
          shadow="shadow-indigo-100"
        />
        <StatCard
          title="Active Members"
          value={stats.activeStudents}
          icon={TrendingUp}
          gradient="from-emerald-500 to-teal-600"
          shadow="shadow-emerald-100"
        />
        <StatCard
          title="Present Today"
          value={stats.presentToday}
          icon={UserCheck}
          gradient="from-blue-500 to-blue-700"
          shadow="shadow-blue-100"
        />
        <StatCard
          title="Absent Today"
          value={stats.absentToday}
          icon={UserMinus}
          gradient="from-rose-500 to-pink-600"
          shadow="shadow-rose-100"
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Attendance Visualizer */}
        <div className="lg:col-span-2 rounded-[2rem] bg-white border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Attendance Analytics
              </h2>
              <p className="text-slate-500 text-sm">
                Daily participation breakdown
              </p>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg">
              <Calendar className="text-slate-400 w-5 h-5" />
            </div>
          </div>

          <div className="space-y-8">
            <Progress
              label="Present Students"
              value={stats.presentToday}
              max={stats.totalStudents}
              color="bg-indigo-600"
            />
            <Progress
              label="Absent Students"
              value={stats.absentToday}
              max={stats.totalStudents}
              color="bg-rose-500"
            />
            <Progress
              label="Member Retention"
              value={stats.activeStudents}
              max={stats.totalStudents}
              color="bg-emerald-500"
            />
          </div>
        </div>

        {/* Action Center */}
        <div className="rounded-[2rem] bg-slate-900 p-8 shadow-xl">
          <h2 className="mb-6 text-xl font-bold text-white">Quick Actions</h2>
          <div className="space-y-4">
            <ActionButton
              label="Add New Student"
              onClick={() => navigate("/add-student")}
            />
            <ActionButton
              label="Mark Attendance"
              onClick={() => navigate("/attendance")}
            />
            <ActionButton
              label="View All Students"
              onClick={() => navigate("/students")}
            />
            <ActionButton
              label="Fees Management"
              onClick={() => navigate("/fees")}
            />
          </div>
        </div>
      </div>

      {/* Footer Summary */}
      <div className="mt-10 rounded-[2.5rem] bg-gradient-to-br from-indigo-900 via-slate-900 to-black p-10 text-white shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
          <h2 className="text-2xl font-bold italic underline decoration-indigo-500 underline-offset-8">
            System Insight
          </h2>
          <p className="text-indigo-300 text-sm mt-2 md:mt-0">
            Live data synchronization active
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <SummaryCard
            label="Database Records"
            value={stats.totalStudents}
            sub="Registered Students"
          />
          <SummaryCard
            label="Weekly Activity"
            value={stats.activeStudents}
            sub="Unique Check-ins"
          />
          <SummaryCard
            label="Today's Traffic"
            value={stats.presentToday + stats.absentToday}
            sub="Entries Processed"
          />
        </div>
      </div>
    </div>
  );
};

/* ---------------- Sub-Components with Enhanced UI ---------------- */

const StatCard = ({ title, value, icon: Icon, gradient, shadow }) => (
  <div
    className={`group relative overflow-hidden rounded-[2rem] border border-white bg-white p-7 shadow-xl ${shadow} transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
  >
    <div
      className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${gradient} text-white mb-5 shadow-lg shadow-current/20`}
    >
      <Icon className="w-6 h-6" />
    </div>
    <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em]">
      {title}
    </p>
    <h2 className="mt-2 text-4xl font-black text-slate-900 tabular-nums">
      {value}
    </h2>
    <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
      <Icon className="w-24 h-24" />
    </div>
  </div>
);

const Progress = ({ label, value, max, color }) => {
  const percent = max ? Math.round((value / max) * 100) : 0;
  return (
    <div className="group">
      <div className="mb-3 flex justify-between items-end">
        <div>
          <span className="block text-sm font-bold text-slate-700">
            {label}
          </span>
          <span className="text-xs font-medium text-slate-400">
            {value} out of {max} total
          </span>
        </div>
        <span
          className={`text-sm font-black ${percent > 50 ? "text-emerald-600" : "text-indigo-600"}`}
        >
          {percent}%
        </span>
      </div>
      <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden shadow-inner">
        <div
          className={`${color} h-full rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

const ActionButton = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="group flex w-full items-center justify-between rounded-2xl border border-slate-700/50 bg-slate-800/50 px-6 py-5 text-left transition-all hover:bg-white hover:scale-[1.02] active:scale-[0.98]"
  >
    <span className="text-sm font-bold text-slate-300 group-hover:text-indigo-900 transition-colors">
      {label}
    </span>
    <div className="bg-slate-700 group-hover:bg-indigo-600 p-1.5 rounded-lg transition-colors">
      <ChevronRight className="w-4 h-4 text-white" />
    </div>
  </button>
);

const SummaryCard = ({ label, value, sub }) => (
  <div className="group rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 transition-colors hover:bg-white/10">
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-1">
      {label}
    </p>
    <h3 className="text-4xl font-black text-white mb-2">{value}</h3>
    <p className="text-xs font-medium text-slate-500 group-hover:text-slate-300 transition-colors">
      {sub}
    </p>
  </div>
);

export default Dashboard;

import { useEffect, useState } from "react";
import { useFees } from "../context/FeesContext";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
} from "lucide-react";

const Fees = () => {
  const { feesStudents, fetchFees, toggleFeeStatus, loading } = useFees();
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchFees(filter);
  }, [filter]);

  const filteredFeesStudents = search
    ? feesStudents.filter(
        (s) =>
          s.libraryId.toLowerCase().includes(search.toLowerCase()) ||
          s.name.toLowerCase().includes(search.toLowerCase()),
      )
    : feesStudents;

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen p-6 md:p-10 bg-white">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Fees Management
        </h1>
        <p className="text-gray-500 mt-1 font-medium">
          Track revenue and manage monthly student subscriptions
        </p>
      </div>

      {/* Filters & Search */}
      <div className="mb-8 flex flex-col lg:flex-row gap-6 lg:items-center justify-between">
        <div className="flex p-1 bg-gray-100 rounded-2xl w-fit">
          <TabButton active={filter === ""} onClick={() => setFilter("")}>
            All
          </TabButton>
          <TabButton
            active={filter === "PAID"}
            onClick={() => setFilter("PAID")}
          >
            Paid
          </TabButton>
          <TabButton
            active={filter === "UNPAID"}
            onClick={() => setFilter("UNPAID")}
          >
            Pending
          </TabButton>
        </div>

        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search student ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Mobile Grid */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredFeesStudents.map((student) => (
          <div
            key={student._id}
            className="bg-gray-50 border border-gray-100 rounded-3xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={student.image?.url}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div>
                <h3 className="font-bold text-gray-900">{student.name}</h3>
                <p className="text-xs font-mono text-gray-500">
                  {student.libraryId}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-gray-100 mb-4">
              <span className="text-sm font-medium text-gray-500">
                Monthly Fee
              </span>
              <span className="font-bold text-gray-900">
                ₹{student.monthlyFees}
              </span>
            </div>

            <div className="flex gap-2">
              {student.feesHistory.map((fee) => (
                <button
                  key={fee.month}
                  onClick={() => toggleFeeStatus(student._id, fee.month)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all shadow-sm
                    ${
                      fee.status === "PAID"
                        ? "bg-emerald-600 text-white"
                        : "bg-rose-600 text-white"
                    }`}
                >
                  {fee.status === "PAID" ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  {fee.status}
                </button>
              ))}
              <button
                onClick={() => navigate(`/students/${student._id}`)}
                className="p-3 bg-gray-900 text-white rounded-xl shadow-sm"
              >
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/50 text-xs font-bold text-gray-500 uppercase">
              <th className="px-8 py-5 text-left">Student Name</th>
              <th className="px-8 py-5 text-left">Library ID</th>
              <th className="px-8 py-5 text-left">Monthly Fees</th>
              <th className="px-8 py-5 text-left">Status Control</th>
              <th className="px-8 py-5 text-center">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredFeesStudents.map((student) => (
              <tr
                key={student._id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <img
                      src={student.image?.url}
                      alt=""
                      className="h-10 w-10 rounded-xl object-cover shadow-sm"
                    />
                    <span className="font-bold text-gray-900">
                      {student.name}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="font-mono text-sm text-gray-500">
                    {student.libraryId}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <span className="font-bold text-gray-900 text-lg">
                    ₹{student.monthlyFees}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <div className="flex gap-2">
                    {student.feesHistory.map((fee) => (
                      <button
                        key={fee.month}
                        onClick={() => toggleFeeStatus(student._id, fee.month)}
                        className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border
                          ${
                            fee.status === "PAID"
                              ? "bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white"
                              : "bg-rose-50 border-rose-100 text-rose-700 hover:bg-rose-600 hover:text-white"
                          }`}
                      >
                        {fee.status === "PAID" ? "Mark Unpaid" : "Mark Paid"}
                        <div
                          className={`w-2 h-2 rounded-full ${fee.status === "PAID" ? "bg-emerald-500 group-hover:bg-white" : "bg-rose-500 group-hover:bg-white"}`}
                        ></div>
                      </button>
                    ))}
                  </div>
                </td>
                <td className="px-8 py-5 text-center">
                  <button
                    onClick={() => navigate(`/students/${student._id}`)}
                    className="p-2 hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 rounded-xl transition-all"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TabButton = ({ children, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all
      ${active ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
  >
    {children}
  </button>
);

export default Fees;

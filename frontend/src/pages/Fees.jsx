import { useEffect, useState } from "react";
import { useFees } from "../context/FeesContext";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const Fees = () => {
  const { feesStudents, fetchFees, toggleFeeStatus, loading } = useFees();
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchFees(filter);
  }, [filter]);

  const filteredFeesStudents = search
    ? feesStudents.filter((s) =>
        s.libraryId.toLowerCase().includes(search.toLowerCase()),
      )
    : feesStudents;

  // console.log(filteredFeesStudents);
  if (loading) return <Loader />;

  return (
    <div className="min-h-screen p-4 sm:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          Fees Management
        </h1>
        <p className="text-sm text-gray-500">
          Track and update monthly fees status of each student
        </p>
      </div>

      {/* Filters + Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <FilterButton active={filter === ""} onClick={() => setFilter("")}>
            All
          </FilterButton>
          <FilterButton
            active={filter === "PAID"}
            onClick={() => setFilter("PAID")}
          >
            Paid
          </FilterButton>
          <FilterButton
            active={filter === "UNPAID"}
            onClick={() => setFilter("UNPAID")}
          >
            Pending
          </FilterButton>
        </div>

        <input
          type="text"
          placeholder="Search by Library ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-black"
        />
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="space-y-4 sm:hidden">
        {filteredFeesStudents.length === 0 ? (
          <p className="text-center text-gray-500">No fee records found</p>
        ) : (
          filteredFeesStudents.map((student) => (
            <div
              key={student._id}
              className="border rounded-xl p-4 bg-white shadow-sm"
            >
              {/* Row 1 */}
              <div className="flex justify-between text-sm font-medium">
                <span>Name: {student.name}</span>
                <span className="font-mono">{student.libraryId}</span>
              </div>

              {/* Row 2 */}
              <div className="mt-3 flex justify-between items-center">
                <span className="font-semibold">
                  Fees: ₹{student.monthlyFees}
                </span>

                {student.feesHistory.map((fee) => (
                  <button
                    key={fee.month}
                    onClick={() => toggleFeeStatus(student._id, fee.month)}
                    className={`px-3 py-1 text-xs rounded font-semibold text-white
                      ${fee.status === "PAID" ? "bg-green-600" : "bg-red-600"}`}
                  >
                    {fee.status}
                  </button>
                ))}
              </div>

              {/* Row 3 */}
              <button
                onClick={() => navigate(`/students/${student._id}`)}
                className="mt-4 w-full border rounded-lg py-2 text-sm font-medium hover:bg-black hover:text-white transition"
              >
                View Profile
              </button>
            </div>
          ))
        )}
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden sm:block bg-white rounded-2xl shadow ring-1 ring-gray-200 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-xs uppercase text-gray-600">
            <tr>
              <th className="px-5 py-4 text-left">Student Name</th>
              <th className="px-5 py-4 text-left">Library ID</th>
              <th className="px-5 py-4 text-left">Monthly Fees</th>
              <th className="px-5 py-4 text-left">Fees Status</th>
              <th className="px-5 py-4 text-center">Profile</th>
            </tr>
          </thead>

          <tbody>
            {filteredFeesStudents.map((student, index) => (
              <tr
                key={student._id}
                className={`border-t ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-5 py-4 gap-2 font-medium flex items-center">
                  <img
                    src={student.image?.url}
                    alt={student.name}
                    className="h-4 w-4 sm:h-10 sm:w-10 rounded-full object-cover"
                  />
                  {student.name}
                </td>
                <td className="px-5 py-4 font-mono text-xs">
                  {student.libraryId}
                </td>
                <td className="px-5 py-4 font-semibold">
                  ₹{student.monthlyFees}
                </td>
                <td className="px-5 py-4">
                  {student.feesHistory.map((fee) => (
                    <button
                      key={fee.month}
                      onClick={() => toggleFeeStatus(student._id, fee.month)}
                      className={`px-3 py-1 text-xs rounded text-white mr-2
                        ${
                          fee.status === "PAID" ? "bg-green-600" : "bg-red-600"
                        }`}
                    >
                      {fee.status === "PAID"
                        ? "Paid(Mark Unpaid)"
                        : "Unpaid(Mark Paid)"}
                    </button>
                  ))}
                </td>
                <td className="px-5 py-4 text-center">
                  <button
                    onClick={() => navigate(`/students/${student._id}`)}
                    className="px-4 py-1.5 text-xs border rounded hover:bg-black hover:text-white"
                  >
                    View
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

/* Filter Button */
const FilterButton = ({ children, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-xl text-sm font-medium
      ${active ? "bg-black text-white" : "bg-white ring-1 ring-gray-300"}`}
  >
    {children}
  </button>
);

export default Fees;

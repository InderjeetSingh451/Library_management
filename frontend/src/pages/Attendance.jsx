import { useState } from "react";
import { useAttendance } from "../context/AttendanceContext";

const Attendance = () => {
  const { markAttendance, loading } = useAttendance();
  const [libraryId, setLibraryId] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    await markAttendance(libraryId);
    setLibraryId("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
      {/* Card */}
      <div className="w-full max-w-sm rounded-2xl bg-white/90 backdrop-blur shadow-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-7">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-3xl text-white shadow-md">
            🎓
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Mark Attendance</h1>
          <p className="text-sm text-gray-600 mt-1">
            Enter your Library ID below
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Library ID
            </label>
            <input
              type="text"
              placeholder="LIB12345"
              value={libraryId}
              onChange={(e) => setLibraryId(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300
              focus:outline-none focus:ring-2 focus:ring-indigo-500
              text-lg tracking-wide"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-lg text-white
            transition-all duration-200 shadow-lg
            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-[0.98]"
            }`}
          >
            {loading ? "Marking Attendance..." : "Mark Attendance"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-xs text-center text-gray-500 mt-6">
          Attendance can be marked only once per day
        </p>
      </div>
    </div>
  );
};

export default Attendance;

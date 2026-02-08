import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStudents } from "../context/StudentContext";
import Loader from "../components/Loader";

const Students = () => {
  const { students, fetchStudents, loading } = useStudents();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = search
    ? students.filter((s) =>
        s.libraryId.toLowerCase().includes(search.toLowerCase()),
      )
    : students;

  if (loading) return <Loader />;

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Students
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          Complete list of enrolled students
        </p>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Library ID"
          className="w-full sm:w-80 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-200 text-gray-700 text-sm">
            <tr>
              <th className="p-3">Student</th>
              <th className="p-3">Library ID</th>

              {/* Hidden on mobile */}
              <th className="p-3 hidden sm:table-cell">Gender</th>
              <th className="p-3 hidden sm:table-cell">Category</th>

              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No students found
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr
                  key={student._id}
                  className="border-t hover:bg-gray-50 hover:cursor-pointer"
                  onClick={() => navigate(`/students/${student._id}`)}
                >
                  {/* Name */}
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={student.image?.url}
                      alt={student.name}
                      className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover"
                    />
                    <span className="font-medium text-gray-800">
                      {student.name}
                    </span>
                  </td>

                  {/* Library ID */}
                  <td className="p-3 font-mono text-sm">{student.libraryId}</td>

                  {/* Hidden on mobile */}
                  <td className="p-3 hidden sm:table-cell">{student.gender}</td>

                  <td className="p-3 hidden sm:table-cell">
                    {student.category}
                  </td>

                  {/* Action */}
                  <td className="p-3 text-center">
                    <button
                      onClick={() => navigate(`/students/${student._id}`)}
                      className="px-3 sm:px-4 py-1 text-sm rounded bg-black text-white hover:bg-gray-800 "
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Students;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useStudents } from "../context/StudentContext";
import Loader from "../components/Loader";

const StudentProfile = () => {
  const { id } = useParams();
  const { getStudentById, deleteStudent } = useStudents();
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await getStudentById(id);
      setData(res);
    })();
  }, [id]);

  if (!data) return <Loader />;

  const { student, attendance } = data;

  // UI-only formatting (safe)
  const enrolledDate = new Date(student.createdAt).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row gap-6">
        {/* Image */}
        <img
          src={student.image?.url}
          alt={student.name}
          className="w-40 h-40 object-cover rounded-lg border"
        />

        {/* Details */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {student.name}
          </h1>

          <p className="text-sm text-gray-500 mb-4">
            Enrolled on:{" "}
            <span className="font-medium text-gray-700">{enrolledDate}</span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
            <p>
              <span className="font-semibold">Father:</span>{" "}
              {student.fatherName}
            </p>
            <p>
              <span className="font-semibold">Library ID:</span>{" "}
              {student.libraryId}
            </p>
            <p>
              <span className="font-semibold">Gender:</span> {student.gender}
            </p>
            <p>
              <span className="font-semibold">Category:</span>{" "}
              {student.category}
            </p>
            <p className="sm:col-span-2">
              <span className="font-semibold">Address:</span> {student.address}
            </p>
          </div>
        </div>
      </div>

      {/* Attendance */}
      {/* Attendance Activity */}
      <div className="bg-white rounded-xl shadow-md p-6 mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Attendance Activity
        </h2>

        {attendance.map((day) => (
          <div key={day._id} className="mb-6 border rounded-lg p-4">
            <div className="flex justify-between mb-3">
              <span className="font-semibold">{day.date}</span>
              <span
                className={`px-3 py-1 rounded-full text-xs ${
                  day.status === "PRESENT"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {day.status}
              </span>
            </div>

            {day.logs.length === 0 ? (
              <p className="text-sm text-gray-400">No activity</p>
            ) : (
              <ul className="space-y-2">
                {day.logs.map((log, index) => (
                  <li
                    key={index}
                    className="flex justify-between text-sm bg-gray-50 px-3 py-2 rounded"
                  >
                    <span
                      className={`font-medium ${
                        log.type === "ENTRY" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {log.type}
                    </span>
                    <span className="text-gray-600">
                      {new Date(log.time).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Delete Button */}
      <div className="mt-8">
        <button
          onClick={() => deleteStudent(student._id)}
          className="bg-red-600 hover:bg-red-700 transition text-white px-6 py-2 rounded-lg shadow"
        >
          Delete Student
        </button>
      </div>
    </div>
  );
};

export default StudentProfile;

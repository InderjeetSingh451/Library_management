import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStudents } from "../context/StudentContext";
import Loader from "../components/Loader";

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getStudentById, deleteStudent, updateStudent } = useStudents();

  const [data, setData] = useState(null);
  const [edit, setEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [openDay, setOpenDay] = useState(null);
  const [form, setForm] = useState({});
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await getStudentById(id);
      setData(res);
      setForm(res.student);
    })();
  }, [id]);

  if (!data) return <Loader />;

  const { student, attendance } = data;
  // console.log(student);
  // console.log(attendance);
  const enrolledDate = new Date(student.createdAt).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const saveHandler = async () => {
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("fatherName", form.fatherName);
    formData.append("gender", form.gender);
    formData.append("category", form.category);
    formData.append("address", form.address);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("monthlyFees", form.monthlyFees);
    if (image) formData.append("image", image);

    await updateStudent(student._id, formData);
    setEdit(false);

    const refreshed = await getStudentById(id);
    setData(refreshed);
  };

  const deleteHandler = async () => {
    await deleteStudent(student._id);
    navigate("/students");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* PROFILE */}
      <div className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row gap-6">
        {/* IMAGE */}
        <div>
          <img
            src={image ? URL.createObjectURL(image) : student.image?.url}
            alt={student.name}
            className="w-40 h-40 object-cover rounded-lg border"
          />

          {edit && (
            <input
              type="file"
              onChange={imageHandler}
              className="mt-3 text-sm"
            />
          )}
        </div>
        {/* DETAILS */}
        <div className="flex-1">
          {!edit ? (
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {student.name}
            </h1>
          ) : (
            <input
              name="name"
              value={form.name}
              onChange={changeHandler}
              className="text-2xl font-bold border p-2 rounded w-full"
            />
          )}

          <p className="text-sm text-gray-500 mb-4">
            Enrolled on:{" "}
            <span className="font-medium text-gray-700">{enrolledDate}</span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {/* Father */}
            <div>
              <span className="font-semibold">Father Name:</span>
              {edit ? (
                <input
                  name="fatherName"
                  value={form.fatherName}
                  onChange={changeHandler}
                  className="border p-1 rounded w-full"
                />
              ) : (
                <span> {student.fatherName}</span>
              )}
            </div>
            <div>
              <span className="font-semibold">Email:</span>
              {edit ? (
                <input
                  name="email"
                  value={form.email}
                  onChange={changeHandler}
                  className="border p-1 rounded w-full"
                />
              ) : (
                <span> {student.email === "" ? "N/A" : student.email}</span>
              )}
            </div>
            <div>
              <span className="font-semibold">Phone:</span>
              {edit ? (
                <input
                  name="phone"
                  value={form.phone}
                  onChange={changeHandler}
                  className="border p-1 rounded w-full"
                />
              ) : (
                <span> {student.phone === "" ? "N/A" : student.phone}</span>
              )}
            </div>
            <div>
              <span className="font-semibold">DOB:</span>
              {edit ? (
                <input
                  name="dob"
                  value={form.dob}
                  type="date"
                  onChange={changeHandler}
                  className="border p-1 rounded w-full"
                />
              ) : (
                <span> {student.dob.slice(0, 10)}</span>
              )}
            </div>
            {/* Library ID (LOCKED) */}
            <p>
              <span className="font-semibold">Library ID:</span>{" "}
              {student.libraryId}
            </p>

            {/* Gender */}
            <div>
              <span className="font-semibold">Gender:</span>
              {edit ? (
                <select
                  name="gender"
                  value={form.gender}
                  onChange={changeHandler}
                  className="border p-1 rounded w-full"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              ) : (
                <span> {student.gender}</span>
              )}
            </div>

            {/* Category */}
            <div>
              <span className="font-semibold">Category:</span>
              {edit ? (
                <select
                  name="category"
                  value={form.category}
                  onChange={changeHandler}
                  className="border p-1 rounded w-full"
                >
                  <option>GEN</option>
                  <option>EWS</option>
                  <option>OBC</option>
                  <option>SC</option>
                  <option>ST</option>
                  <option>Other</option>
                </select>
              ) : (
                <span> {student.category}</span>
              )}
            </div>
            <div>
              <span className="font-bold">Fees: </span>
              {edit ? (
                <input
                  name="monthlyFees"
                  value={form.monthlyFees}
                  type="number"
                  onChange={changeHandler}
                  className="border p-1 rounded w-full"
                />
              ) : (
                <span className="font-semibold">{student.monthlyFees} INR</span>
              )}
            </div>
            {/* Address */}
            <div className="sm:col-span-2">
              <span className="font-semibold">Address:</span>
              {edit ? (
                <textarea
                  name="address"
                  value={form.address}
                  onChange={changeHandler}
                  className="border p-2 rounded w-full"
                />
              ) : (
                <span> {student.address}</span>
              )}
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-6 flex gap-3">
            {!edit ? (
              <button
                onClick={() => setEdit(true)}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg"
              >
                Edit
              </button>
            ) : (
              <>
                <button
                  onClick={saveHandler}
                  className="bg-green-600 text-white px-5 py-2 rounded-lg"
                >
                  Save
                </button>
                <button
                  onClick={() => setEdit(false)}
                  className="bg-gray-300 px-5 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ================= ATTENDANCE ================= */}
      <div className="bg-white rounded-xl shadow-md p-6 mt-8">
        <h2 className="text-xl font-semibold mb-6">Attendance Activity</h2>

        <div className="space-y-4">
          {attendance.map((day) => {
            const isOpen = openDay === day._id;
            const isPresent = day.status === "PRESENT";

            return (
              <div key={day._id} className="border rounded-lg overflow-hidden">
                {/* DATE BOX */}
                <button
                  onClick={() => setOpenDay(isOpen ? null : day._id)}
                  className={`w-full flex justify-between items-center px-4 py-3 text-sm font-semibold transition
                    ${
                      isPresent
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    }`}
                >
                  <span>{day.date}</span>
                  <span>{isOpen ? "▲" : "▼"}</span>
                </button>

                {/* ACTIVITY (EXPAND) */}
                {isOpen && (
                  <div className="p-4 bg-gray-50">
                    {day.logs.length === 0 ? (
                      <p className="text-sm text-gray-400">No activity</p>
                    ) : (
                      <ul className="space-y-2">
                        {day.logs.map((log, index) => (
                          <li
                            key={index}
                            className="flex justify-between items-center bg-white px-3 py-2 rounded text-sm border"
                          >
                            <span
                              className={`font-medium ${
                                log.type === "ENTRY"
                                  ? "text-green-600"
                                  : "text-red-600"
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
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* DELETE */}
      <div className="mt-8">
        <button
          onClick={() => setShowDelete(true)}
          className="bg-red-600 text-white px-6 py-2 rounded-lg"
        >
          Delete Student
        </button>
      </div>

      {/* DELETE MODAL */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h3 className="text-lg font-semibold mb-4">Are you sure?</h3>
            <p className="text-sm text-gray-600 mb-6">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDelete(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={deleteHandler}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;


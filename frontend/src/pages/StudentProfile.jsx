import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStudents } from "../context/StudentContext";
import Loader from "../components/Loader";

/* ================= AGE CALCULATOR ================= */
const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

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

  const enrolledDate = new Date(student.createdAt).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  /* ================= CHANGE HANDLER ================= */
  const changeHandler = (e) => {
    const { name, value } = e.target;

    if (name === "dob") {
      const age = calculateAge(value);

      if (age < 3) {
        alert("Student must be at least 3 years old");
        return;
      }

      setForm({
        ...form,
        dob: value,
        age,
      });
    } else {
      setForm({ ...form, [name]: value });
    }
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
    formData.append("dob", form.dob);
    formData.append("age", form.age);
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
      {/* ================= PROFILE ================= */}
      <div className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row gap-6  ">
        {/* IMAGE */}
        <div className="flex-shrink-0">
          <div className="w-40 h-40 rounded-lg overflow-hidden border-2 border-blue-200">
            <img
              src={image ? URL.createObjectURL(image) : student.image?.url}
              alt={student.name}
              className="w-full h-full object-cover"
            />
          </div>

          {edit && (
            <input
              type="file"
              onChange={imageHandler}
              className="mt-2 text-xs"
            />
          )}
        </div>

        {/* DETAILS */}
        <div className="flex-1">
          {/* NAME */}
          {!edit ? (
            <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
          ) : (
            <input
              name="name"
              value={form.name}
              onChange={changeHandler}
              className="text-xl font-bold border p-2 rounded w-full"
            />
          )}

          <p className="text-xs text-gray-500 mb-4">
            Enrolled on{" "}
            <span className="font-medium text-gray-700">{enrolledDate}</span>
          </p>

          {/* INFO GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <InfoRow label="Father Name" value={student.fatherName} edit={edit}>
              <input
                name="fatherName"
                value={form.fatherName}
                onChange={changeHandler}
                className="border p-1 rounded w-full"
              />
            </InfoRow>

            <InfoRow label="Email" value={student.email || "N/A"} edit={edit}>
              <input
                name="email"
                value={form.email}
                onChange={changeHandler}
                className="border p-1 rounded w-full"
              />
            </InfoRow>

            <InfoRow label="Phone" value={student.phone || "N/A"} edit={edit}>
              <input
                name="phone"
                value={form.phone}
                onChange={changeHandler}
                className="border p-1 rounded w-full"
              />
            </InfoRow>

            <InfoRow label="DOB" value={student.dob?.slice(0, 10)} edit={edit}>
              <input
                name="dob"
                type="date"
                value={form.dob}
                max={
                  new Date(new Date().setFullYear(new Date().getFullYear() - 3))
                    .toISOString()
                    .split("T")[0]
                }
                onChange={changeHandler}
                className="border p-1 rounded w-full"
              />
            </InfoRow>

            <InfoRow label="Age" value={student.age} />

            <InfoRow label="Library ID" value={student.libraryId} />

            <div>
              <p className="text-xs text-gray-500">Gender</p>
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
                <span className="inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                  {student.gender}
                </span>
              )}
            </div>

            <div>
              <p className="text-xs text-gray-500">Category</p>
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
                <span className="inline-block px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
                  {student.category}
                </span>
              )}
            </div>

            <div>
              <p className="text-xs text-gray-500">Fees</p>
              {edit ? (
                <input
                  name="monthlyFees"
                  value={form.monthlyFees}
                  type="number"
                  onChange={changeHandler}
                  className="border p-1 rounded w-full"
                />
              ) : (
                <span className="font-semibold text-green-700">
                  ₹ {student.monthlyFees}
                </span>
              )}
            </div>

            <div className="sm:col-span-2">
              <InfoRow label="Address" value={student.address} edit={edit}>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={changeHandler}
                  className="border p-1 rounded w-full"
                />
              </InfoRow>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="mt-4 flex gap-3">
            {!edit ? (
              <button
                onClick={() => setEdit(true)}
                className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm hover:bg-blue-700"
              >
                Edit
              </button>
            ) : (
              <>
                <button
                  onClick={saveHandler}
                  className="bg-green-600 text-white px-4 py-1.5 rounded-md text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => setEdit(false)}
                  className="bg-gray-200 px-4 py-1.5 rounded-md text-sm"
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
                <button
                  onClick={() => setOpenDay(isOpen ? null : day._id)}
                  className={`w-full flex justify-between items-center px-4 py-3 text-sm font-semibold
                    ${
                      isPresent
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                >
                  <span>{day.date}</span>
                  <span>{isOpen ? "▲" : "▼"}</span>
                </button>

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
const InfoRow = ({ label, value, edit = false, children }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    {edit ? children : <p className="font-medium text-gray-800">{value}</p>}
  </div>
);
export default StudentProfile;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStudents } from "../context/StudentContext";
import Loader from "../components/Loader";

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getStudentById, deleteStudent, updateStudent } = useStudents();

  const [data, setData] = useState(null);
  const [save, setSave] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    name: "",
    fatherName: "",
    dob: "",
    age: "",
    gender: "",
    category: "",
    address: "",
    monthlyFees: "",
    email: "",
    phone: "",
  });

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
  });

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const updateHandler = async (e) => {
    e.preventDefault();
    setSave(true);

    const formData = new FormData();
    Object.keys(form).forEach(
      (key) => key !== "libraryId" && formData.append(key, form[key]),
    );

    if (image) formData.append("image", image);

    await updateStudent(student._id, formData);

    setEditMode(false);
    setSave(false);
    navigate(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* PROFILE CARD */}
      <div className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row gap-6">
        <img
          src={student.image?.url}
          alt={student.name}
          className="w-40 h-40 object-cover rounded-lg border"
        />

        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{student.name}</h1>

          <p className="text-sm text-gray-500 mb-4">
            Enrolled on: <span className="font-medium">{enrolledDate}</span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <p>
              <b>Father:</b> {student.fatherName}
            </p>
            <p>
              <b>Library ID:</b> {student.libraryId}
            </p>
            <p>
              <b>Email:</b> {student.email || "N/A"}
            </p>
            <p>
              <b>Phone:</b> {student.phone || "N/A"}
            </p>
            <p>
              <b>Gender:</b> {student.gender}
            </p>
            <p>
              <b>Category:</b> {student.category}
            </p>
            <p className="sm:col-span-2">
              <b>Address:</b> {student.address}
            </p>
          </div>
        </div>
      </div>

      {/* EDIT FORM */}
      {editMode && (
        <form
          onSubmit={updateHandler}
          className="bg-white rounded-xl shadow mt-8 p-6"
        >
          <h2 className="text-lg font-semibold mb-6 text-gray-800">
            Edit Student Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Student Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={changeHandler}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* Father */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Father Name
              </label>
              <input
                name="fatherName"
                value={form.fatherName}
                onChange={changeHandler}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* DOB */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={changeHandler}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium mb-1">Age</label>
              <input
                name="age"
                value={form.age}
                onChange={changeHandler}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={changeHandler}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={changeHandler}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select Category</option>
                <option value="GEN">GEN</option>
                <option value="EWS">EWS</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Fees */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Monthly Fees
              </label>
              <input
                name="monthlyFees"
                value={form.monthlyFees}
                onChange={changeHandler}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                name="email"
                value={form.email}
                onChange={changeHandler}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={changeHandler}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-3">
              <label className="block text-sm font-medium mb-1">Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={changeHandler}
                rows={3}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* Image */}
            <div className="md:col-span-3">
              <label className="block text-sm font-medium mb-1">
                Update Profile Image
              </label>
              <input type="file" onChange={imageHandler} />
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="px-6 py-2 rounded-lg border"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-indigo-600 text-white"
            >
              {save ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      )}

      {/* ATTENDANCE */}
      <div className="bg-white rounded-xl shadow-md p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Attendance Activity</h2>
        {attendance.map((day) => (
          <div key={day._id} className="mb-4 border rounded-lg p-4">
            <div className="flex justify-between">
              <span>{day.date}</span>
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
          </div>
        ))}
      </div>

      {/* ACTION BUTTONS */}
      {!editMode && (
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => setEditMode(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
          >
            Edit Student
          </button>
          <button
            onClick={() => deleteStudent(student._id)}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
          >
            Delete Student
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;

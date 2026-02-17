import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStudents } from "../context/StudentContext";
import Loader from "../components/Loader";

/* ================= DATE HELPERS ================= */
const toLocalDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

/* ================= AGE CALCULATOR ================= */
const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
};

/* ================= LAST 3 MONTH RANGE ================= */
const getLast3MonthsRange = (attendance) => {
  if (!attendance.length) return null;

  const dates = attendance.map((a) => new Date(a.date));
  const latest = new Date(Math.max(...dates));
  const start = new Date(latest);
  start.setMonth(start.getMonth() - 2); // EXACT 3 MONTHS

  return { start, end: latest };
};

const formatDateOnly = (date) => {
  if (!date) return "—";
  return date.split("T")[0];
};

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getStudentById, deleteStudent, updateStudent } = useStudents();

  const [data, setData] = useState(null);
  const [edit, setEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [form, setForm] = useState({});
  const [image, setImage] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(false);
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

  /* ================= HANDLERS ================= */
  const changeHandler = (e) => {
    const { name, value } = e.target;

    if (name === "dob") {
      const age = calculateAge(value);
      if (age < 3) return alert("Student must be at least 3 years old");
      setForm({ ...form, dob: value, age });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const imageHandler = (e) => setImage(e.target.files[0]);

  const saveHandler = async () => {
    setLoading(true);
    const formData = new FormData();

    // ❗ DO NOT send libraryId
    Object.keys(form).forEach((key) => {
      if (key !== "libraryId") {
        formData.append(key, form[key]);
      }
    });

    if (image) formData.append("image", image);

    await updateStudent(student._id, formData);
    setEdit(false);
    setLoading(false);
    setData(await getStudentById(id));
  };

  const deleteHandler = async () => {
    await deleteStudent(student._id);
    navigate("/students");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* ================= PROFILE ================= */}
      <div className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row gap-6">
        {/* IMAGE */}
        <div>
          <div className="w-40 h-40 rounded-lg overflow-hidden border">
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
          {edit ? (
            <input
              name="name"
              value={form.name}
              onChange={changeHandler}
              className="border p-2 w-full font-bold text-xl"
            />
          ) : (
            <h1 className="text-2xl font-bold">{student.name}</h1>
          )}

          <p className="text-xs text-gray-500 mb-4">
            Enrolled on <span className="font-medium">{enrolledDate}</span>
          </p>

          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <EditableField
              label="Father Name"
              name="fatherName"
              value={form.fatherName}
              edit={edit}
              onChange={changeHandler}
            />
            <EditableField
              label="Email"
              name="email"
              value={form.email}
              edit={edit}
              onChange={changeHandler}
            />
            <EditableField
              label="Phone"
              name="phone"
              value={form.phone}
              edit={edit}
              onChange={changeHandler}
            />
            <EditableField
              label="DOB"
              name="dob"
              type="date"
              value={edit ? form.dob : formatDateOnly(form.dob)}
              edit={edit}
              onChange={changeHandler}
            />
            <EditableField label="Age" value={student.age} />
            {/* 🔒 ONLY NON-EDITABLE FIELD */}
            <EditableField
              label="Library ID"
              value={student.libraryId}
              locked
            />

            <EditableSelect
              label="Gender"
              name="gender"
              value={form.gender}
              edit={edit}
              onChange={changeHandler}
              options={["Male", "Female", "Other"]}
            />

            <EditableSelect
              label="Category"
              name="category"
              value={form.category}
              edit={edit}
              onChange={changeHandler}
              options={["GEN", "EWS", "OBC", "SC", "ST", "Other"]}
            />

            <EditableField
              label="Fees"
              name="monthlyFees"
              type="number"
              value={form.monthlyFees}
              edit={edit}
              onChange={changeHandler}
            />

            <div className="sm:col-span-2">
              <EditableTextarea
                label="Address"
                name="address"
                value={form.address}
                edit={edit}
                onChange={changeHandler}
              />
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            {!edit ? (
              <button
                onClick={() => setEdit(true)}
                className="bg-blue-600 text-white px-4 py-1.5 rounded"
              >
                Edit
              </button>
            ) : (
              <>
                <button
                  onClick={saveHandler}
                  className="bg-green-600 text-white px-4 py-1.5 rounded"
                >
                  {loading ? "Saving.." : "Save"}
                </button>
                <button
                  onClick={() => setEdit(false)}
                  className="bg-gray-200 px-4 py-1.5 rounded"
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
        <h2 className="text-xl font-semibold mb-6">Attendance History</h2>
        <AttendanceCalendar attendance={attendance} onSelect={setSelectedDay} />
      </div>

      <AttendanceModal day={selectedDay} onClose={() => setSelectedDay(null)} />
      {/* ================= DELETE STUDENT ================= */}
      <div className="mt-10 flex justify-center">
        <button
          onClick={() => setShowDelete(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-sm font-medium"
        >
          Delete Student
        </button>
      </div>
      {showDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96">
            <h3 className="text-lg font-semibold mb-3">Delete Student</h3>
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

/* ================= REUSABLE FIELDS ================= */

const EditableField = ({
  label,
  name,
  value,
  edit,
  onChange,
  type = "text",
  locked = false,
}) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    {locked || !edit ? (
      <p className={`font-medium ${locked ? "text-gray-600" : ""}`}>
        {value || "—"}
      </p>
    ) : (
      <input
        name={name}
        type={type}
        value={value || ""}
        onChange={onChange}
        className="border p-1 rounded w-full"
      />
    )}
  </div>
);

const EditableSelect = ({ label, name, value, edit, onChange, options }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    {edit ? (
      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        className="border p-1 rounded w-full"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    ) : (
      <p className="font-medium">{value || "—"}</p>
    )}
  </div>
);

const EditableTextarea = ({ label, name, value, edit, onChange }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    {edit ? (
      <textarea
        name={name}
        value={value || ""}
        onChange={onChange}
        className="border p-1 rounded w-full"
      />
    ) : (
      <p className="font-medium">{value || "—"}</p>
    )}
  </div>
);

/* ================= CALENDAR & MODAL (UNCHANGED) ================= */

const AttendanceCalendar = ({ attendance, onSelect }) => {
  const today = new Date();
  const range = getLast3MonthsRange(attendance);
  if (!range) return <p>No attendance</p>;

  const map = {};
  attendance.forEach((a) => {
    map[toLocalDateKey(new Date(a.date))] = a;
  });

  const months = [];
  let cur = new Date(range.end.getFullYear(), range.end.getMonth(), 1);
  const start = new Date(range.start.getFullYear(), range.start.getMonth(), 1);

  while (cur >= start) {
    months.unshift(new Date(cur));
    cur.setMonth(cur.getMonth() - 1);
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {months.map((m, i) => {
        const y = m.getFullYear();
        const mo = m.getMonth();
        const firstDay = new Date(y, mo, 1).getDay();
        const days = new Date(y, mo + 1, 0).getDate();

        return (
          <div key={i} className="border rounded p-4">
            <h3 className="text-center font-semibold mb-2">
              {m.toLocaleString("en-IN", { month: "long", year: "numeric" })}
            </h3>

            <div className="grid grid-cols-7 text-xs text-center mb-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-xs">
              {[...Array(firstDay)].map((_, i) => (
                <div key={i} />
              ))}

              {[...Array(days)].map((_, d) => {
                const date = new Date(y, mo, d + 1);
                const key = toLocalDateKey(date);
                const record = map[key];
                const disabled = date > today || date < range.start || !record;

                return (
                  <button
                    key={d}
                    disabled={disabled}
                    onClick={() => onSelect(record)}
                    className={`h-8 rounded
                      ${record?.status === "PRESENT" ? "bg-green-300" : record?.status === "ABSENT" ? "bg-red-300" : "bg-gray-200"}
                      ${disabled ? "opacity-40" : "hover:ring-2"}
                    `}
                  >
                    {d + 1}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const AttendanceModal = ({ day, onClose }) => {
  if (!day) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96">
        <h3 className="font-semibold mb-3">
          {day.date} ({day.status})
        </h3>

        {day.logs.length === 0 ? (
          <p className="text-sm text-gray-500">No activity</p>
        ) : (
          <ul className="space-y-2">
            {day.logs.map((l, i) => (
              <li
                key={i}
                className="flex justify-between border px-3 py-2 text-sm rounded"
              >
                <span
                  className={
                    l.type === "ENTRY" ? "text-green-600" : "text-red-600"
                  }
                >
                  {l.type}
                </span>
                <span>
                  {new Date(l.time).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="text-right mt-4">
          <button onClick={onClose} className="bg-gray-200 px-4 py-1.5 rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;

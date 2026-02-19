import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStudents } from "../context/StudentContext";
import Loader from "../components/Loader";
import {
  User,
  Mail,
  Phone,
  Calendar,
  IdCard,
  MapPin,
  Trash2,
  Edit3,
  Save,
  X,
  Camera,
  ChevronLeft,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Layers,
} from "lucide-react";

/* ================= DATE HELPERS ================= */
const toLocalDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
};

const getLast3MonthsRange = (attendance) => {
  if (!attendance?.length) return null;
  const dates = attendance.map((a) => new Date(a.date));
  const latest = new Date(Math.max(...dates));
  const start = new Date(latest);
  start.setMonth(start.getMonth() - 2);
  return { start, end: latest };
};

const formatDateOnly = (date) => (date ? date.split("T")[0] : "—");

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

  const enrolledDate = new Date(student.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
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
    Object.keys(form).forEach((key) => {
      if (key !== "libraryId") formData.append(key, form[key]);
    });
    if (image) formData.append("image", image);

    await updateStudent(student._id, formData);
    setEdit(false);
    setLoading(false);
    setData(await getStudentById(id));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      {/* Top Navigation */}
      <div className="max-w-6xl mx-auto mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate("/students")}
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-bold transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />{" "}
          <span className="hidden sm:inline">Back to Directory</span>
        </button>
        <div className="flex gap-3">
          {!edit ? (
            <button
              onClick={() => setEdit(true)}
              className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-all"
            >
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={() => setEdit(false)}
                className="px-4 py-2 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={saveHandler}
                disabled={loading}
                className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
              >
                <Save className="w-4 h-4" />{" "}
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Overview */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 p-8 text-center">
            <div className="relative inline-block group">
              <img
                src={image ? URL.createObjectURL(image) : student.image?.url}
                alt={student.name}
                className="w-40 h-40 rounded-[2.5rem] object-cover ring-8 ring-indigo-50 shadow-inner"
              />
              {edit && (
                <label className="absolute bottom-2 right-2 p-3 bg-indigo-600 text-white rounded-2xl cursor-pointer shadow-lg hover:scale-110 transition-transform">
                  <Camera className="w-5 h-5" />
                  <input
                    type="file"
                    className="hidden"
                    onChange={imageHandler}
                  />
                </label>
              )}
            </div>

            <h1 className="mt-6 text-2xl font-black text-gray-900 leading-tight">
              {edit ? (
                <input
                  name="name"
                  value={form.name}
                  onChange={changeHandler}
                  className="text-center w-full border-b-2 border-indigo-100 focus:border-indigo-600 outline-none pb-1 bg-transparent"
                />
              ) : (
                student.name
              )}
            </h1>
            <p className="text-indigo-600 font-black text-xs uppercase tracking-widest mt-2 px-4 py-1 bg-indigo-50 rounded-full inline-block">
              ID: {student.libraryId}
            </p>

            <div className="mt-8 pt-8 border-t border-gray-50 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 font-bold">Age</span>
                <span className="text-gray-900 font-black">
                  {student.age} Years
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 font-bold">Gender</span>
                <span className="text-gray-900 font-black">
                  {student.gender}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xs font-black uppercase tracking-widest text-indigo-300 mb-4">
                Registration Info
              </h3>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Calendar className="w-5 h-5 text-indigo-200" />
                </div>
                <div>
                  <p className="text-[10px] text-indigo-300 font-black uppercase tracking-wider">
                    Enrolled On
                  </p>
                  <p className="font-bold text-base">{enrolledDate}</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full" />
          </div>
        </div>

        {/* Right Column: Detailed Editable Form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 p-8">
            <h2 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
              <IdCard className="w-6 h-6 text-indigo-600" /> Member Information
            </h2>

            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
              <EditableField
                icon={User}
                label="Father's Name"
                name="fatherName"
                value={form.fatherName}
                edit={edit}
                onChange={changeHandler}
              />
              <EditableField
                icon={Mail}
                label="Email Address"
                name="email"
                value={form.email}
                edit={edit}
                onChange={changeHandler}
              />
              <EditableField
                icon={Phone}
                label="Contact Number"
                name="phone"
                value={form.phone}
                edit={edit}
                onChange={changeHandler}
              />
              <EditableField
                icon={Calendar}
                label="Date of Birth"
                name="dob"
                type="date"
                value={edit ? form.dob : formatDateOnly(form.dob)}
                edit={edit}
                onChange={changeHandler}
              />

              <EditableSelect
                icon={User}
                label="Gender"
                name="gender"
                value={form.gender}
                edit={edit}
                onChange={changeHandler}
                options={["Male", "Female", "Other"]}
              />

              {/* CATEGORY IS NOW EDITABLE */}
              <EditableSelect
                icon={Layers}
                label="Category"
                name="category"
                value={form.category}
                edit={edit}
                onChange={changeHandler}
                options={["GEN", "EWS", "OBC", "SC", "ST", "Other"]}
              />

              <EditableField
                icon={Clock}
                label="Monthly Fees"
                name="monthlyFees"
                type="number"
                value={form.monthlyFees}
                edit={edit}
                onChange={changeHandler}
                prefix="₹"
              />

              {/* LIBRARY ID IS LOCKED */}
              <EditableField
                icon={IdCard}
                label="Library ID (Locked)"
                value={student.libraryId}
                locked
              />

              <div className="md:col-span-2">
                <EditableTextarea
                  icon={MapPin}
                  label="Home Address"
                  name="address"
                  value={form.address}
                  edit={edit}
                  onChange={changeHandler}
                />
              </div>
            </div>
          </div>

          {/* Attendance */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 p-8">
            <h2 className="text-xl font-black text-gray-900 mb-8">
              Activity History
            </h2>
            <AttendanceCalendar
              attendance={attendance}
              onSelect={setSelectedDay}
            />
          </div>

          {/* Delete Action */}
          <div className="p-8 border-2 border-dashed border-red-100 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h4 className="text-red-600 font-black">Danger Zone</h4>
              <p className="text-gray-400 text-sm font-medium">
                Remove this student and all associated logs permanently.
              </p>
            </div>
            <button
              onClick={() => setShowDelete(true)}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-2xl text-sm font-black hover:bg-red-600 hover:text-white transition-all"
            >
              <Trash2 className="w-4 h-4" /> Delete Student
            </button>
          </div>
        </div>
      </div>

      <AttendanceModal day={selectedDay} onClose={() => setSelectedDay(null)} />

      {/* Delete Confirmation */}
      {showDelete && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white p-8 rounded-[2.5rem] max-w-sm w-full shadow-2xl scale-in-center">
            <div className="p-4 bg-red-50 w-fit rounded-2xl mb-6 mx-auto md:mx-0">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2 text-center md:text-left">
              Delete Account?
            </h3>
            <p className="text-gray-500 font-medium mb-8 text-center md:text-left">
              This will remove {student.name} from the library database
              permanently.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDelete(false)}
                className="flex-1 py-4 bg-gray-100 rounded-2xl font-bold text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteStudent(student._id)}
                className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= REUSABLE COMPONENTS ================= */

const EditableField = ({
  label,
  icon: Icon,
  name,
  value,
  edit,
  onChange,
  type = "text",
  prefix,
  locked,
}) => (
  <div className="group">
    <div className="flex items-center gap-2 mb-2">
      <Icon
        className={`w-4 h-4 ${locked ? "text-gray-300" : "text-indigo-400"}`}
      />
      <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">
        {label}
      </span>
    </div>
    {edit && !locked ? (
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-400">
            {prefix}
          </span>
        )}
        <input
          name={name}
          type={type}
          value={value || ""}
          onChange={onChange}
          className={`w-full bg-gray-50 border border-gray-100 p-3 rounded-xl font-bold text-gray-900 outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all ${prefix ? "pl-8" : ""}`}
        />
      </div>
    ) : (
      <p
        className={`font-bold text-sm truncate ${locked ? "text-gray-400" : "text-gray-900"}`}
      >
        {prefix}
        {value || "—"}
      </p>
    )}
  </div>
);

const EditableSelect = ({
  label,
  icon: Icon,
  name,
  value,
  edit,
  onChange,
  options,
}) => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <Icon className="w-4 h-4 text-indigo-400" />
      <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">
        {label}
      </span>
    </div>
    {edit ? (
      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl font-bold text-gray-900 outline-none focus:ring-2 focus:ring-indigo-600/20 cursor-pointer"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    ) : (
      <p className="font-bold text-gray-900 text-sm">{value || "—"}</p>
    )}
  </div>
);

const EditableTextarea = ({
  label,
  icon: Icon,
  name,
  value,
  edit,
  onChange,
}) => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <Icon className="w-4 h-4 text-indigo-400" />
      <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">
        {label}
      </span>
    </div>
    {edit ? (
      <textarea
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl font-bold text-gray-900 outline-none min-h-[100px] focus:ring-2 focus:ring-indigo-600/20 transition-all"
      />
    ) : (
      <p className="font-bold text-gray-900 text-sm leading-relaxed">
        {value || "—"}
      </p>
    )}
  </div>
);

/* Calendar & Modal remain as styled in previous step */
const AttendanceCalendar = ({ attendance, onSelect }) => {
  const range = getLast3MonthsRange(attendance);
  if (!range)
    return (
      <div className="p-12 text-center bg-gray-50 rounded-2xl font-bold text-gray-400">
        No attendance history available
      </div>
    );

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
    <div className="grid md:grid-cols-3 gap-8">
      {months.map((m, i) => {
        const y = m.getFullYear(),
          mo = m.getMonth();
        const firstDay = new Date(y, mo, 1).getDay();
        const days = new Date(y, mo + 1, 0).getDate();

        return (
          <div key={i} className="group">
            <h3 className="text-center font-black text-gray-900 mb-4 text-sm uppercase tracking-widest">
              {m.toLocaleString("en-IN", { month: "short", year: "numeric" })}
            </h3>
            <div className="grid grid-cols-7 gap-1 text-[10px] font-black text-gray-300 text-center mb-2">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, j) => (
                <span key={j}>{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {[...Array(firstDay)].map((_, j) => (
                <div key={j} />
              ))}
              {[...Array(days)].map((_, d) => {
                const date = new Date(y, mo, d + 1);
                const record = map[toLocalDateKey(date)];
                const isPresent = record?.status === "PRESENT";
                const isAbsent = record?.status === "ABSENT";

                return (
                  <button
                    key={d}
                    disabled={!record}
                    onClick={() => onSelect(record)}
                    className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-black transition-all
                      ${isPresent ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : isAbsent ? "bg-rose-100 text-rose-700 border border-rose-200" : "bg-gray-50 text-gray-300"}
                      ${record ? "hover:scale-110 shadow-sm cursor-pointer" : "cursor-default opacity-40"}
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
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl">
        <div
          className={`p-6 flex items-center justify-between text-white ${day.status === "PRESENT" ? "bg-emerald-600" : "bg-rose-600"}`}
        >
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80">
              {new Date(day.date).toLocaleDateString("en-IN", {
                weekday: "long",
              })}
            </p>
            <h3 className="text-xl font-black">{day.date}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/20 rounded-xl hover:bg-white/30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-8">
          {day.logs.length === 0 ? (
            <p className="text-center text-gray-400 py-4 font-bold">
              No activity logs
            </p>
          ) : (
            <div className="space-y-6">
              {day.logs.map((l, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs bg-gray-50">
                    {l.type === "ENTRY" ? (
                      <ArrowRight className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <X className="w-4 h-4 text-rose-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-black text-gray-900 text-sm">{l.type}</p>
                    <p className="text-xs font-bold text-gray-400">
                      {new Date(l.time).toLocaleTimeString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={onClose}
            className="w-full mt-8 py-4 bg-gray-900 text-white rounded-2xl font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;

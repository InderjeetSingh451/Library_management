import { useState } from "react";
import { useStudents } from "../context/StudentContext";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

const AddStudent = () => {
  const { addStudent, loading } = useStudents();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    fatherName: "",
    dob: "",
    age: "",
    gender: "",
    category: "",
    address: "",
    monthlyFees: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const imageHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!image) return alert("Image is required");

    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    formData.append("image", image);

    await addStudent(formData);
    navigate("/students");
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-indigo-600 to-violet-600 px-10 py-6 text-white shadow">
        <h1 className="text-3xl font-bold">Add New Student</h1>
        <p className="text-indigo-100">Fill student details carefully</p>
      </div>

      {/* Form */}
      <form onSubmit={submitHandler} className="px-10 py-8 space-y-10">
        {/* Basic Info */}
        <Section title="Basic Information">
          <Input
            label="Student Name"
            name="name"
            placeholder="Enter student name"
            onChange={changeHandler}
          />
          <Input
            label="Father Name"
            name="fatherName"
            placeholder="Enter father name"
            onChange={changeHandler}
          />
        </Section>

        {/* Personal Info */}
        <Section title="Personal Details">
          <Input
            label="Date of Birth"
            name="dob"
            type="date"
            onChange={changeHandler}
          />
          <Input
            label="Age"
            name="age"
            type="number"
            placeholder="Age"
            onChange={changeHandler}
          />
          <Select
            label="Gender"
            name="gender"
            options={["Male", "Female", "Other"]}
            onChange={changeHandler}
          />
          <Select
            label="Category"
            name="category"
            options={["GEN", "EWS", "OBC", "SC", "ST", "Other"]}
            onChange={changeHandler}
          />
        </Section>

        {/* Address */}
        <Section title="Address">
          <Textarea
            label="Full Address"
            name="address"
            placeholder="Enter full address"
            onChange={changeHandler}
          />
        </Section>

        {/* Fees */}
        <Section title="Fees Information">
          <Input
            label="Monthly Fees"
            name="monthlyFees"
            type="number"
            placeholder="Monthly fees"
            onChange={changeHandler}
          />
        </Section>

        {/* Image Upload + Preview */}
        <Section title="Student Photo">
          <div className="flex items-start gap-8">
            {/* Upload */}
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={imageHandler}
                required
                className="w-full p-4 border-2 border-dashed rounded-xl bg-white
                hover:border-indigo-500 transition"
              />
            </div>

            {/* Preview */}
            <div className="w-40">
              <p className="text-sm font-semibold mb-2">Preview</p>
              <div className="w-40 h-40 rounded-xl border bg-white flex items-center justify-center overflow-hidden shadow">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">No Image</span>
                )}
              </div>
            </div>
          </div>
        </Section>

        {/* Submit */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            className="px-12 py-3 text-lg font-semibold rounded-xl text-white
            bg-gradient-to-r from-indigo-600 to-violet-600
            hover:from-indigo-700 hover:to-violet-700
            shadow-lg hover:shadow-xl transition"
          >
            Save Student
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudent;

/* ================= UI COMPONENTS ================= */

const Section = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow p-8">
    <h2 className="text-xl font-bold mb-6 border-l-4 border-indigo-500 pl-4">
      {title}
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  </div>
);

const Input = ({ label, name, type = "text", placeholder, onChange }) => (
  <div>
    <label className="block text-sm font-semibold mb-2">{label}</label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      required
      className="w-full px-4 py-3 rounded-xl border
      focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>
);

const Select = ({ label, name, options, onChange }) => (
  <div>
    <label className="block text-sm font-semibold mb-2">{label}</label>
    <select
      name={name}
      onChange={onChange}
      required
      className="w-full px-4 py-3 rounded-xl border
      focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <option value="">Select {label}</option>
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  </div>
);

const Textarea = ({ label, name, placeholder, onChange }) => (
  <div className="md:col-span-2 lg:col-span-3">
    <label className="block text-sm font-semibold mb-2">{label}</label>
    <textarea
      name={name}
      rows={4}
      placeholder={placeholder}
      onChange={onChange}
      required
      className="w-full px-4 py-3 rounded-xl border
      focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>
);

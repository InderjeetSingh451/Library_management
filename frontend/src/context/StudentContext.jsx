import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";
const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const { authAxios } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data } = await authAxios.get("/api/students");
      setStudents(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const getStudentById = async (id) => {
    try {
      setLoading(true);
      const { data } = await authAxios.get(`/api/students/${id}`);
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (id) => {
    try {
      await authAxios.delete(`/api/students/${id}`);
      setStudents((prev) => prev.filter((s) => s._id !== id));
      toast.success("Student deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };
  const addStudent = async (formData) => {
    try {
      setLoading(true);

      const res = await authAxios.post("/api/students", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Student added successfully");
      fetchStudents(); // refresh list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add student");
    } finally {
      setLoading(false);
    }
  };
  return (
    <StudentContext.Provider
      value={{
        students,
        loading,
        fetchStudents,
        getStudentById,
        deleteStudent,
        addStudent,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudents = () => useContext(StudentContext);

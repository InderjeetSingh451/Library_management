import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

const FeesContext = createContext();

export const FeesProvider = ({ children }) => {
  const { authAxios } = useAuth();
  const [feesStudents, setFeesStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFees = async (status = "") => {
    try {
      setLoading(true);
      const { data } = await authAxios.get(
        `/api/fees${status ? `?status=${status}` : ""}`,
      );
      setFeesStudents(data);
    } catch (error) {
      toast.error("Failed to load fees data");
    } finally {
      setLoading(false);
    }
  };

  const toggleFeeStatus = async (studentId, month) => {
    try {
      const { data } = await authAxios.put(`/api/fees/${studentId}`, { month });
      setFeesStudents((prev) =>
        prev.map((s) => (s._id === data._id ? data : s)),
      );
      toast.success("Fees updated");
    } catch (error) {
      toast.error("Fees update failed");
    }
  };

  return (
    <FeesContext.Provider
      value={{ feesStudents, fetchFees, toggleFeeStatus, loading }}
    >
      {children}
    </FeesContext.Provider>
  );
};

export const useFees = () => useContext(FeesContext);

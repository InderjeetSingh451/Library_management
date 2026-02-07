import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const { authAxios } = useAuth();
  const [loading, setLoading] = useState(false);

  /**
   * Mark attendance using Library ID
   * Handles ENTRY / EXIT toggle
   */
  const markAttendance = async (libraryId) => {
    if (!libraryId) {
      toast.error("Library ID is required");
      return null;
    }

    try {
      setLoading(true);
      
      const { data } = await authAxios.post("/api/attendance/mark", {
        libraryId,
      });

      // Expected backend response:
      // { message, type: "ENTRY" | "EXIT", time }

      if (data?.type && data?.time) {
        const formattedTime = new Date(data.time).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        });

        toast.success(`${data.type} marked at ${formattedTime}`);
      } else {
        toast.success(data?.message || "Attendance marked");
      }

      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark attendance");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AttendanceContext.Provider
      value={{
        loading,
        markAttendance,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => useContext(AttendanceContext);

import { createContext, useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(
    JSON.parse(localStorage.getItem("admin")) || null,
  );
  const [loading, setLoading] = useState(false);
  // Axios instance (unchanged)
  const authAxios = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });

  authAxios.interceptors.request.use((config) => {
    if (admin?.token) {
      config.headers.Authorization = `Bearer ${admin.token}`;
    }
    return config;
  });

  /* ---------------- LOGIN ---------------- */
  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        { email, password },
      );

      setAdmin(data);
      localStorage.setItem("admin", JSON.stringify(data));
      toast.success("Login successful");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- REQUEST OTP (NEW) ---------------- */
  const requestOTP = async () => {
    try {
      setLoading(true);
      await authAxios.post("/api/auth/request-admin-otp");
      toast.success("OTP sent to Super Admin");
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP request failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SIGNUP (UPDATED: OTP ADDED) ---------------- */
  const signup = async (email, password, otp) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/signup`,
        { email, password, otp },
      );

      setAdmin(data);
      localStorage.setItem("admin", JSON.stringify(data));
      toast.success("Admin created successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- LOGOUT ---------------- */
  const logout = () => {
    localStorage.removeItem("admin");
    setAdmin(null);
    toast.success("Logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        signup,
        login,
        logout,
        loading,
        authAxios,
        requestOTP, // ✅ exposed
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

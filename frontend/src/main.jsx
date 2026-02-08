import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { StudentProvider } from "./context/StudentContext";
import { AttendanceProvider } from "./context/AttendanceContext";
import { FeesProvider } from "./context/FeesContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <StudentProvider>
        <AttendanceProvider>
          <FeesProvider>
            <App />
            <Toaster position="top-right" />
          </FeesProvider>
        </AttendanceProvider>
      </StudentProvider>
    </AuthProvider>
    <ToastContainer />
  </React.StrictMode>,
);

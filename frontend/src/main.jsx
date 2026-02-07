import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { StudentProvider } from "./context/StudentContext";
import { AttendanceProvider } from "./context/AttendanceContext";
import { FeesProvider } from "./context/FeesContext";

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
  </React.StrictMode>,
);

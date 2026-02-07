import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg text-sm font-medium transition
     ${isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-200"}`;

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between bg-white px-4 py-3 shadow md:hidden">
        <h2 className="font-bold text-lg">Library Admin</h2>
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          ☰
        </button>
      </div>

      {/* Overlay (mobile) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-64 bg-gray-100 p-4
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <h2 className="text-xl font-bold mb-6 text-center">Library Admin</h2>

        <nav className="space-y-2">
          <NavLink to="/" onClick={() => setOpen(false)} className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink
            to="/students"
            onClick={() => setOpen(false)}
            className={linkClass}
          >
            Students
          </NavLink>
          <NavLink
            to="/fees"
            onClick={() => setOpen(false)}
            className={linkClass}
          >
            Fees Details
          </NavLink>
          <NavLink
            to="/add-student"
            onClick={() => setOpen(false)}
            className={linkClass}
          >
            Add New Student
          </NavLink>
          <NavLink
            to="/attendance"
            onClick={() => setOpen(false)}
            className={linkClass}
          >
            Attendance
          </NavLink>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-100"
          >
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

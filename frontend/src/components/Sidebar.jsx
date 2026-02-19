import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  UserPlus,
  CalendarCheck,
  LogOut,
  Menu,
  X,
  Library,
} from "lucide-react";

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/students", label: "Students", icon: Users },
    { to: "/fees", label: "Fees Details", icon: CreditCard },
    { to: "/add-student", label: "Add Student", icon: UserPlus },
    { to: "/attendance", label: "Attendance", icon: CalendarCheck },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
     ${
       isActive
         ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
         : "text-gray-600 hover:bg-white hover:text-indigo-600 hover:shadow-sm"
     }`;

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between bg-white/80 backdrop-blur-md px-6 py-4 border-b md:hidden">
        <div className="flex items-center gap-2">
          <Library className="w-6 h-6 text-indigo-600" />
          <h2 className="font-bold text-gray-900 tracking-tight">
            Library Admin
          </h2>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg bg-gray-50 border"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-72 bg-gray-50 border-r border-gray-200 p-6
          transform transition-all duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <Library className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Library Admin
          </h2>
          <button onClick={() => setOpen(false)} className="ml-auto md:hidden">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <nav className="flex flex-col h-[calc(100%-120px)]">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={linkClass}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="mt-auto pt-6 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

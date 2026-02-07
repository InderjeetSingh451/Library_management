import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    try {
      login(email, password);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <form
        onSubmit={submitHandler}
        className="w-full max-w-md bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8"
      >
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-lg font-bold shadow">
            A
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to access the dashboard
          </p>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="admin@example.com"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5
              focus:outline-none focus:ring-2 focus:ring-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5
              focus:outline-none focus:ring-2 focus:ring-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Login Button */}
        <button
          disabled={loading}
          className={`w-full py-2.5 rounded-lg font-medium text-white transition
            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-900"
            }`}
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Don’t have an admin account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-black font-medium hover:underline cursor-pointer"
          >
            Create one
          </span>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          Authorized access only
        </p>
      </form>
    </div>
  );
};

export default Login;

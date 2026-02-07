import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const { signup, requestOTP, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const sendOTP = async () => {
    await requestOTP();
    setOtpSent(true);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    signup(email, password, otp);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <form
        onSubmit={submitHandler}
        className="w-full max-w-md bg-white/95 backdrop-blur p-8 rounded-2xl shadow-2xl"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Create Admin Account
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          Secure admin access with Super Admin OTP verification
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="admin@example.com"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* OTP Section */}
        {!otpSent ? (
          <button
            type="button"
            onClick={sendOTP}
            className="w-full bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-900 transition"
          >
            Request OTP
          </button>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                OTP
              </label>
              <input
                placeholder="Enter 6-digit OTP"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-black"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            <button
              disabled={loading}
              className={`w-full py-2.5 rounded-lg font-medium text-white transition
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-900"
                }`}
            >
              {loading ? "Creating Admin..." : "Create Admin"}
            </button>
          </>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-black font-medium hover:underline cursor-pointer"
          >
            Login
          </span>
        </div>
      </form>
    </div>
  );
};

export default Signup;

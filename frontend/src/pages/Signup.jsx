import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  UserPlus,
  Mail,
  Lock,
  Key,
  ChevronLeft,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

const Signup = () => {
  const { signup, requestOTP, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Logic Improvement: Validate credentials before allowing OTP request
  const isFormValid = email.includes("@") && password.length >= 6;

  const sendOTP = async () => {
    if (!isFormValid) {
      setError("Please enter a valid email and password first.");
      return;
    }
    setError("");
    try {
      // Logic Improvement: Pass credentials to requestOTP if your backend needs them
      await requestOTP(email, password);
      setOtpSent(true);
    } catch (err) {
      setError("Failed to send OTP. Please check your connection.");
      console.error(err);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signup(email, password, otp);
      navigate("/login");
    } catch (err) {
      setError("Signup failed. Please check the OTP or try again.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1115] relative overflow-hidden px-4 font-sans">
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-amber-600/5 rounded-full blur-[150px]"></div>

      <div className="w-full max-w-md z-10">
        <Link
          to="/login"
          className="flex items-center gap-2 text-slate-500 hover:text-amber-500 mb-8 transition-colors group w-fit"
        >
          <ChevronLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-sm font-medium">Back to Sign In</span>
        </Link>

        <form
          onSubmit={submitHandler}
          className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 md:p-10"
        >
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-amber-600/20 border border-amber-600/30 flex items-center justify-center text-amber-500 shadow-inner">
              <UserPlus size={28} />
            </div>
            <h2 className="text-3xl font-serif font-bold text-white tracking-tight">
              Admin Enrollment
            </h2>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                Official Email
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors"
                  size={18}
                />
                <input
                  type="email"
                  placeholder="admin@library.gov"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                Secure Password
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors"
                  size={18}
                />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  required
                />
              </div>
            </div>

            {/* OTP Section */}
            {!otpSent ? (
              <div className="pt-4">
                <button
                  type="button"
                  onClick={sendOTP}
                  disabled={!isFormValid || loading}
                  className={`w-full py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 group
                    ${
                      isFormValid
                        ? "bg-amber-600/20 border border-amber-600/40 text-amber-500 hover:bg-amber-600 hover:text-white"
                        : "bg-white/5 border border-white/5 text-slate-600 cursor-not-allowed"
                    }`}
                >
                  <ShieldCheck
                    size={20}
                    className={isFormValid ? "group-hover:scale-110" : ""}
                  />
                  Request Verification OTP
                </button>
              </div>
            ) : (
              <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-amber-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Key size={14} /> Verification Code
                  </label>
                  <input
                    placeholder="— — — — — —"
                    className="w-full bg-amber-500/5 border border-amber-500/30 rounded-xl px-4 py-4 text-white text-center tracking-[1em] font-mono text-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>

                <button
                  disabled={loading}
                  className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-xl
                    ${loading ? "bg-slate-700 opacity-50" : "bg-amber-600 hover:bg-amber-500 shadow-amber-900/20"}`}
                >
                  {loading ? "Finalizing..." : "Complete Registration"}
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;

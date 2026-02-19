import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, ChevronLeft, Library } from "lucide-react";

const Login = () => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Added error logic for better UX
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1115] relative overflow-hidden px-4 font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-900/10 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md z-10">
        {/* Back to Home */}
        <Link
          to="/"
          className="flex items-center gap-2 text-slate-500 hover:text-amber-500 mb-8 transition-colors group w-fit"
        >
          <ChevronLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-sm font-medium">Back to Library Home</span>
        </Link>

        <form
          onSubmit={submitHandler}
          className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 md:p-10"
        >
          {/* Header */}
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-amber-600 flex items-center justify-center shadow-lg shadow-amber-900/20 rotate-3 hover:rotate-0 transition-transform duration-300">
              <Library className="text-white" size={28} />
            </div>
            <h2 className="text-3xl font-serif font-bold text-white tracking-tight">
              Portal Access
            </h2>
            <p className="text-sm text-slate-400 mt-2 font-light">
              Enter your credentials to manage the sanctuary
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                Librarian Email
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors"
                  size={18}
                />
                <input
                  type="email"
                  placeholder="admin@ambedkar.edu"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:bg-white/[0.07] transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                Access Key
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors"
                  size={18}
                />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:bg-white/[0.07] transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Login Button */}
          <button
            disabled={loading}
            className={`w-full mt-10 py-4 rounded-xl font-bold text-white transition-all shadow-xl
              ${
                loading
                  ? "bg-slate-700 cursor-not-allowed opacity-50"
                  : "bg-amber-600 hover:bg-amber-500 active:scale-[0.98] shadow-amber-900/20"
              }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Authenticating...
              </span>
            ) : (
              "Sign In"
            )}
          </button>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Need a new access?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-amber-500 font-semibold hover:text-amber-400 cursor-pointer transition-colors"
              >
                Request Account
              </span>
            </p>
          </div>
        </form>

        <p className="mt-8 text-center text-xs text-slate-600 uppercase tracking-[0.2em]">
          Secure Administrative Gateway
        </p>
      </div>
    </div>
  );
};

export default Login;

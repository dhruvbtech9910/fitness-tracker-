import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  CheckCircle2,
  AlertCircle,
  Dumbbell,
  Sparkles,
} from "lucide-react";
import Button from "../components/Button";
import authService from "../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [forgotModal, setForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in both your email and password.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);
      const res = await authService.login(email, password, rememberMe);
      if (res && res.success) {
        setSuccess(true);
        setTimeout(() => {
          if (email.toLowerCase().includes("admin")) {
            navigate("/admin");
          } else {
            navigate("/dashboard");
          }
        }, 600);
      }
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (type) => {
    setError("");
    setLoading(true);
    const demoEmail = type === "admin" ? "admin@fitpulse.pro" : "alex.vance@fitpulse.pro";
    const demoPass = "password123";
    setEmail(demoEmail);
    setPassword(demoPass);

    try {
      await authService.login(demoEmail, demoPass, true);
      setSuccess(true);
      setTimeout(() => {
        navigate(type === "admin" ? "/admin" : "/dashboard");
      }, 500);
    } catch (err) {
      setError("Demo login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotSuccess(false);
      setForgotModal(false);
      setForgotEmail("");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#070908] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-grid-pattern relative">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#b8ff32]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-5xl grid lg:grid-cols-[1.1fr_1fr] rounded-3xl border border-white/10 bg-[#0a0d0b]/90 backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden relative z-10">
        {/* LEFT COLUMN: BRAND STORY & MOTIVATION */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#0c120e] via-[#080d0a] to-[#050706] border-r border-white/10 relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#b8ff32]/10 blur-3xl pointer-events-none" />

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#b8ff32] text-[#070908] shadow-[0_0_25px_rgba(184,255,50,0.4)]">
              <Activity size={24} strokeWidth={2.7} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-[-0.03em] text-white">
                  FITPULSE
                </span>
                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-black uppercase text-[#b8ff32]">
                  PRO
                </span>
              </div>
              <p className="text-[9px] font-bold tracking-[0.25em] text-zinc-400">
                ATHLETE OPERATING SYSTEM
              </p>
            </div>
          </Link>

          {/* Motivation copy */}
          <div className="my-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3.5 py-1 text-[11px] font-bold text-[#b8ff32] mb-6">
              <Sparkles size={13} />
              <span>Quantified Human Performance</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tight text-white leading-tight">
              Unlock Your <span className="text-[#b8ff32]">Physical Ceiling</span> With Precision.
            </h2>
            <p className="mt-4 text-sm text-zinc-400 leading-relaxed">
              Track multi-set volume load, monitor heart strain zones, and hit your fitness milestones with zero guesswork.
            </p>

            {/* Quick stats callout */}
            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
              <div>
                <span className="text-2xl font-black text-white">99.9%</span>
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Data Accuracy
                </p>
              </div>
              <div>
                <span className="text-2xl font-black text-[#b8ff32]">+22%</span>
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Avg. Strength Growth
                </p>
              </div>
            </div>
          </div>

          {/* Security footnote */}
          <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
            <Shield size={14} className="text-emerald-400" />
            <span>Biometric Data Fully Encrypted</span>
          </div>
        </div>

        {/* RIGHT COLUMN: LOGIN FORM */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          {/* Mobile brand header */}
          <div className="lg:hidden mb-6 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#b8ff32] text-[#070908]">
                <Activity size={18} strokeWidth={2.7} />
              </div>
              <span className="text-base font-black text-white">FITPULSE</span>
            </Link>
            <Link to="/" className="text-xs text-zinc-400 hover:text-white">
              Back to Home
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              Sign In To Lab
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-zinc-400">
              Enter athlete credentials to access your session telemetry.
            </p>
          </div>

          {/* Quick Demo Accounts Buttons */}
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.02] p-3.5">
            <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2.5">
              ⚡ Instant 1-Click Demo Login
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin("athlete")}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2 px-3 text-xs font-bold text-white hover:border-[#b8ff32] hover:text-[#b8ff32] transition cursor-pointer"
              >
                <Dumbbell size={13} />
                <span>Athlete Demo</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin("admin")}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2 px-3 text-xs font-bold text-white hover:border-amber-400 hover:text-amber-400 transition cursor-pointer"
              >
                <Shield size={13} />
                <span>Admin Demo</span>
              </button>
            </div>
          </div>

          {/* Error / Success messages */}
          {error && (
            <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs font-bold text-rose-300">
              <AlertCircle size={16} className="shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-bold text-emerald-300">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
              <span>Authentication successful! Redirecting to workspace...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="athlete@fitpulse.pro"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-xs font-medium text-white placeholder-zinc-500 focus:border-[#b8ff32] focus:outline-none focus:ring-1 focus:ring-[#b8ff32] transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModal(true)}
                  className="text-[11px] font-bold text-[#b8ff32] hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-11 text-xs font-medium text-white placeholder-zinc-500 focus:border-[#b8ff32] focus:outline-none focus:ring-1 focus:ring-[#b8ff32] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-white/5 text-[#b8ff32] focus:ring-0 focus:ring-offset-0 accent-[#b8ff32]"
                />
                <span className="text-xs text-zinc-400 font-medium">Remember athlete session</span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading}
                icon={ArrowRight}
                className="w-full"
              >
                {loading ? "Authenticating..." : "Sign In to Dashboard"}
              </Button>
            </div>
          </form>

          {/* Footer link to Register */}
          <div className="mt-8 text-center border-t border-white/10 pt-6">
            <p className="text-xs text-zinc-400">
              Don't have an athlete account?{" "}
              <Link
                to="/register"
                className="font-bold text-[#b8ff32] hover:underline"
              >
                Create Account Now
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {forgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-zinc-950 p-6 shadow-2xl">
            <h3 className="text-lg font-black uppercase text-white">Reset Account Key</h3>
            <p className="mt-1 text-xs text-zinc-400">
              Enter your registered email address and we'll dispatch an instant reset link.
            </p>

            {forgotSuccess ? (
              <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>Password reset token sent to your email!</span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="mt-4 space-y-4">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="athlete@fitpulse.pro"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-3.5 text-xs text-white placeholder-zinc-500 focus:border-[#b8ff32] focus:outline-none"
                />
                <div className="flex gap-2">
                  <Button type="submit" variant="primary" size="sm" className="flex-1">
                    Send Reset Link
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setForgotModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

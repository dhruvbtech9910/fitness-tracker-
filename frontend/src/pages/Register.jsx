import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Target,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Button from "../components/Button";
import authService from "../services/authService";
import { GOAL_CATEGORIES, ACTIVITY_LEVELS } from "../utils/constants";

export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fitnessGoal, setFitnessGoal] = useState("Muscle Gain");
  const [activityLevel, setActivityLevel] = useState("Moderate");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Compute password strength
  const getPasswordStrength = () => {
    if (!password) return { score: 0, text: "None", color: "bg-zinc-700" };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) return { score: 25, text: "Weak", color: "bg-rose-500" };
    if (score === 3) return { score: 60, text: "Medium", color: "bg-amber-400" };
    return { score: 100, text: "Strong", color: "bg-emerald-400" };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim()) {
      setError("Please provide your full athlete name.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please provide a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    if (!termsAgreed) {
      setError("You must accept the terms of service to proceed.");
      return;
    }

    try {
      setLoading(true);
      const res = await authService.register({
        fullName,
        email,
        password,
        fitnessGoal,
        activityLevel,
      });

      if (res && res.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 600);
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070908] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-grid-pattern relative">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#b8ff32]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-5xl grid lg:grid-cols-[1fr_1.2fr] rounded-3xl border border-white/10 bg-[#0a0d0b]/90 backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden relative z-10">
        {/* LEFT COLUMN: BRAND STORY */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#0c120e] via-[#080d0a] to-[#050706] border-r border-white/10 relative overflow-hidden">
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-[#b8ff32]/10 blur-3xl pointer-events-none" />

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
                ATHLETE ENROLLMENT
              </p>
            </div>
          </Link>

          {/* Value Prop */}
          <div className="my-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3.5 py-1 text-[11px] font-bold text-[#b8ff32] mb-6">
              <Sparkles size={13} />
              <span>Full Access Athlete Trial</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tight text-white leading-tight">
              Build The Body. <br />
              <span className="text-[#b8ff32]">Quantify The Work.</span>
            </h2>
            <p className="mt-4 text-sm text-zinc-400 leading-relaxed">
              Join thousands of dedicated athletes tracking workouts, conquering 30-day challenges, and hitting calculated PRs.
            </p>

            <div className="mt-8 space-y-3">
              {[
                "Automatic RPE & 1-Rep Max calculations",
                "Curated exercise catalog & custom routines",
                "Interactive strain analytics & milestone records",
                "Community leaderboards & live check-ins",
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-zinc-300">
                  <CheckCircle2 size={16} className="text-[#b8ff32] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>Zero Spam. 100% Athlete Privacy Guaranteed.</span>
          </div>
        </div>

        {/* RIGHT COLUMN: REGISTRATION FORM */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="lg:hidden mb-6 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#b8ff32] text-[#070908]">
                <Activity size={18} strokeWidth={2.7} />
              </div>
              <span className="text-base font-black text-white">FITPULSE</span>
            </Link>
            <Link to="/login" className="text-xs text-zinc-400 hover:text-white">
              Sign In Instead
            </Link>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              Create Athlete Profile
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400">
              Set up your profile to personalize training load recommendations.
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs font-bold text-rose-300">
              <AlertCircle size={16} className="shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-bold text-emerald-300">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
              <span>Account generated successfully! Initializing dashboard...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name & Email grid */}
            <div className="grid sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                  />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Vance"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-xs text-white placeholder-zinc-500 focus:border-[#b8ff32] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="athlete@fitpulse.pro"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-xs text-white placeholder-zinc-500 focus:border-[#b8ff32] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Password & Confirm Password grid */}
            <div className="grid sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 chars"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-9 text-xs text-white placeholder-zinc-500 focus:border-[#b8ff32] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Match password"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-xs text-white placeholder-zinc-500 focus:border-[#b8ff32] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Password strength meter */}
            {password && (
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
                <div className="flex justify-between text-[10px] font-bold text-zinc-400 mb-1">
                  <span>Password Security:</span>
                  <span className={strength.score === 100 ? "text-emerald-400" : "text-amber-400"}>
                    {strength.text}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${strength.color}`}
                    style={{ width: `${strength.score}%` }}
                  />
                </div>
              </div>
            )}

            {/* Fitness Goal & Activity Level */}
            <div className="grid sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                  Primary Fitness Goal
                </label>
                <select
                  value={fitnessGoal}
                  onChange={(e) => setFitnessGoal(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0e120f] py-2.5 px-3 text-xs text-white focus:border-[#b8ff32] focus:outline-none"
                >
                  <option value="Muscle Gain">Muscle Hypertrophy & Strength</option>
                  <option value="Weight Loss">Fat Loss & Leanness</option>
                  <option value="Endurance">Cardio & VO2 Max Endurance</option>
                  <option value="Athletic Performance">Athletic Conditioning</option>
                  <option value="Habit">Daily Health & Mobility</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                  Training Frequency
                </label>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0e120f] py-2.5 px-3 text-xs text-white focus:border-[#b8ff32] focus:outline-none"
                >
                  <option value="Moderate">3-4 sessions / week</option>
                  <option value="Very Active">5-6 sessions / week</option>
                  <option value="Daily Athlete">7 days / week (Elite)</option>
                  <option value="Light">1-2 sessions / week</option>
                </select>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 text-[#b8ff32] focus:ring-0 focus:ring-offset-0 accent-[#b8ff32]"
                />
                <span className="text-[11px] text-zinc-400 leading-tight">
                  I agree to the FitPulse Pro{" "}
                  <a href="#" className="text-white underline hover:text-[#b8ff32]">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-white underline hover:text-[#b8ff32]">
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>
            </div>

            {/* Submit */}
            <div className="pt-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading}
                icon={ArrowRight}
                className="w-full"
              >
                {loading ? "Creating Account..." : "Complete Registration"}
              </Button>
            </div>
          </form>

          {/* Footer link to Login */}
          <div className="mt-6 text-center border-t border-white/10 pt-5">
            <p className="text-xs text-zinc-400">
              Already registered?{" "}
              <Link
                to="/login"
                className="font-bold text-[#b8ff32] hover:underline"
              >
                Sign In To Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

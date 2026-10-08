import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Activity, Menu, X, ArrowUpRight, Plus, User, LogIn, LayoutDashboard } from "lucide-react";
import Button from "./Button";
import authService from "../services/authService";

export default function Navbar({ onOpenQuickLog, activeStreak = 14 }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();
  const isLoggedIn = authService.isAuthenticated();

  const navLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Workouts", href: "/workouts" },
    { label: "Goals", href: "/goals" },
    { label: "Challenges", href: "/challenges" },
    { label: "Progress", href: "/progress" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070908]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-5 sm:px-8 lg:px-12">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#b8ff32] text-[#070908] transition-transform duration-300 group-hover:scale-105 shadow-[0_0_20px_rgba(184,255,50,0.35)]">
            <Activity size={20} strokeWidth={2.7} />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-[-0.03em] text-white">
                FITPULSE
              </span>
              <span className="rounded bg-white/10 px-1 py-0.5 text-[8px] font-black uppercase text-[#b8ff32]">
                PRO
              </span>
            </div>
            <p className="text-[8px] font-bold tracking-[0.25em] text-zinc-400">
              PERFORMANCE LAB
            </p>
          </div>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.label}
                to={link.href}
                className={`text-xs font-bold uppercase tracking-[0.14em] transition-colors hover:text-[#b8ff32] ${
                  isActive ? "text-[#b8ff32]" : "text-zinc-400"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT SIDE ACTIONS */}
        <div className="hidden items-center gap-4 sm:flex">
          {/* Live Sync Pill */}
          <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-[10px] font-bold text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="uppercase tracking-wider">
              {user?.activeStreak || activeStreak}d Streak 🔥
            </span>
          </div>

          {/* Quick Log Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenQuickLog || (() => navigate("/workouts"))}
            icon={Plus}
            iconPosition="left"
            className="hidden md:inline-flex"
          >
            Quick Log
          </Button>

          {/* Login / Dashboard CTA */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                icon={LayoutDashboard}
                iconPosition="left"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </Button>
              <Link
                to="/profile"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:text-white hover:border-[#b8ff32]/50 transition"
                title="Profile Settings"
              >
                <User size={18} />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/login")}
                icon={LogIn}
                iconPosition="left"
              >
                Sign In
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={ArrowUpRight}
                onClick={() => navigate("/register")}
              >
                Get Started
              </Button>
            </div>
          )}
        </div>

        {/* MOBILE HAMBURGER BUTTON */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={onOpenQuickLog || (() => navigate("/workouts"))}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#b8ff32] text-[#070908] sm:hidden"
            title="Quick Log"
          >
            <Plus size={18} strokeWidth={2.5} />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN DRAWER */}
      {mobileMenuOpen && (
        <div className="border-b border-white/10 bg-[#070908] px-6 py-6 lg:hidden animate-in slide-in-from-top-4">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-bold uppercase tracking-wider py-2 border-b border-white/5 transition-colors ${
                  location.pathname === link.href ? "text-[#b8ff32]" : "text-zinc-300 hover:text-[#b8ff32]"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-4 flex flex-col gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenQuickLog) onOpenQuickLog();
                  else navigate("/workouts");
                }}
                icon={Plus}
                iconPosition="left"
              >
                Quick Log Workout
              </Button>

              {isLoggedIn ? (
                <>
                  <Button
                    variant="primary"
                    size="md"
                    icon={LayoutDashboard}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/dashboard");
                    }}
                  >
                    Open Dashboard
                  </Button>
                  <Button
                    variant="dark"
                    size="md"
                    icon={User}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/profile");
                    }}
                  >
                    My Profile
                  </Button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="dark"
                    size="md"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/login");
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/register");
                    }}
                  >
                    Register
                  </Button>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

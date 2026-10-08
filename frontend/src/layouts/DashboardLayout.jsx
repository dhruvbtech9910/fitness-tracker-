import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Activity,
  LayoutDashboard,
  Dumbbell,
  Target,
  Trophy,
  TrendingUp,
  User,
  LogOut,
  Menu,
  X,
  Plus,
  Flame,
  Shield,
  ChevronRight,
} from "lucide-react";
import authService from "../services/authService";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Workouts", href: "/workouts", icon: Dumbbell },
    { label: "Goals", href: "/goals", icon: Target },
    { label: "Progress", href: "/progress", icon: TrendingUp },
    { label: "Challenges", href: "/challenges", icon: Trophy },
    { label: "Profile", href: "/profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#070908] text-[#f3f4f6] flex flex-col lg:flex-row">
      {/* MOBILE HEADER BAR */}
      <div className="lg:hidden sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-[#070908]/95 px-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#b8ff32] text-[#070908]">
              <Activity size={18} strokeWidth={2.5} />
            </div>
            <span className="text-sm font-black tracking-tight text-white">FITPULSE</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-[10px] font-bold text-zinc-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{user?.activeStreak || 14}d</span>
          </div>

          <Link
            to="/profile"
            className="h-8 w-8 rounded-lg overflow-hidden border border-white/20 bg-white/10"
          >
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          </Link>
        </div>
      </div>

      {/* BACKDROP FOR MOBILE SIDEBAR */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-white/10 bg-[#0a0d0b] transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col">
          {/* Logo & Platform Info */}
          <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
            <Link
              to="/"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#b8ff32] text-[#070908] shadow-[0_0_20px_rgba(184,255,50,0.35)] transition-transform group-hover:scale-105">
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
                  ATHLETE PORTAL
                </p>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="text-zinc-400 hover:text-white lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          {/* User Quick Glance */}
          <div className="p-4 mx-4 my-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
            <div className="relative">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                alt={user?.name || "User"}
                className="h-10 w-10 rounded-xl object-cover border border-white/10"
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-[#0a0d0b]" />
            </div>
            <div className="overflow-hidden flex-1">
              <h4 className="text-xs font-black uppercase tracking-tight text-white truncate">
                {user?.name || "Alex Vance"}
              </h4>
              <p className="text-[10px] text-zinc-400 font-medium truncate">
                {user?.membershipTier || "Pro Athlete"}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-[#b8ff32] flex items-center gap-0.5">
                <Flame size={10} className="fill-[#b8ff32]" />
                {user?.activeStreak || 14}d
              </span>
              <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider">
                Streak
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 px-4">
            <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
              Core Modules
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <NavLink
                  key={item.label}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? "bg-[#b8ff32] text-[#070908] shadow-[0_0_20px_rgba(184,255,50,0.3)] font-black"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={17} strokeWidth={isActive ? 2.5 : 2} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight size={14} strokeWidth={3} />}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer / Account / Admin */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/admin"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition"
          >
            <Shield size={16} className="text-[#b8ff32]" />
            <span>Admin Console</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* DESKTOP TOP HEADER */}
        <header className="hidden lg:flex h-20 items-center justify-between border-b border-white/10 bg-[#070908]/80 px-8 backdrop-blur-xl sticky top-0 z-30">
          <div>
            <h1 className="text-lg font-black uppercase tracking-tight text-white">
              {navItems.find((n) => n.href === location.pathname)?.label || "Performance Lab"}
            </h1>
            <p className="text-[11px] font-semibold text-zinc-400">
              Biometric Exertion & Progression System
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/workouts"
              className="flex items-center gap-1.5 rounded-xl bg-[#b8ff32] px-4 py-2 text-xs font-black uppercase tracking-wider text-[#070908] hover:bg-[#c9ff4d] transition shadow-[0_0_20px_rgba(184,255,50,0.3)] cursor-pointer"
            >
              <Plus size={15} strokeWidth={3} />
              <span>Log Workout</span>
            </Link>

            <div className="h-6 w-px bg-white/10" />

            <Link
              to="/profile"
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 hover:border-white/20 transition"
            >
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                alt="Avatar"
                className="h-7 w-7 rounded-lg object-cover"
              />
              <div className="text-left">
                <span className="block text-xs font-black text-white leading-tight">
                  {user?.name || "Alex Vance"}
                </span>
                <span className="text-[10px] font-bold text-[#b8ff32] leading-tight">
                  {user?.activeStreak || 14}d Streak
                </span>
              </div>
            </Link>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  ShieldAlert,
  Users,
  Dumbbell,
  Settings,
  Activity,
  ArrowLeft,
  LogOut,
  Menu,
  X,
  Server,
} from "lucide-react";
import authService from "../services/authService";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const navItems = [
    { label: "Overview & KPIs", href: "/admin", icon: Activity },
    { label: "User Management", href: "/admin#users", icon: Users },
    { label: "Curated Content", href: "/admin#content", icon: Dumbbell },
    { label: "System Settings", href: "/admin#settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#060807] text-[#f3f4f6] flex flex-col lg:flex-row">
      {/* MOBILE HEADER */}
      <div className="lg:hidden sticky top-0 z-40 flex h-16 items-center justify-between border-b border-amber-500/20 bg-[#060807]/95 px-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:text-white"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShieldAlert size={16} />
            </span>
            <span className="text-sm font-black text-white">ADMIN CONSOLE</span>
          </div>
        </div>

        <Link
          to="/dashboard"
          className="text-xs font-bold text-zinc-400 hover:text-[#b8ff32] flex items-center gap-1"
        >
          <ArrowLeft size={13} />
          <span>Exit</span>
        </Link>
      </div>

      {/* MOBILE BACKDROP */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ADMIN SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-amber-500/20 bg-[#0a0c0a] transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Header Branding */}
          <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-[#070908] shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                <ShieldAlert size={20} strokeWidth={2.5} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black tracking-tight text-white">
                    FITPULSE
                  </span>
                  <span className="rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1 py-0.5 text-[8px] font-black uppercase">
                    ROOT
                  </span>
                </div>
                <p className="text-[8px] font-bold tracking-[0.2em] text-zinc-400">
                  SYSTEM ADMINISTRATION
                </p>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="text-zinc-400 hover:text-white lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          {/* System Status Pill */}
          <div className="p-4 mx-4 my-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold text-zinc-300">Cluster Status</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              OPERATIONAL
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 px-4">
            <div className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
              Control Panel
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:bg-white/5 hover:text-white transition"
                >
                  <Icon size={17} className="text-amber-400" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold text-zinc-300 hover:text-[#b8ff32] hover:bg-white/5 transition"
          >
            <ArrowLeft size={16} />
            <span>Return to User Portal</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
          >
            <LogOut size={16} />
            <span>Sign Out of Admin</span>
          </button>
        </div>
      </aside>

      {/* MAIN ADMIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="hidden lg:flex h-20 items-center justify-between border-b border-white/10 bg-[#060807]/80 px-8 backdrop-blur-xl sticky top-0 z-30">
          <div>
            <h1 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
              <span>Admin Management Hub</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                v2.4-PROD
              </span>
            </h1>
            <p className="text-[11px] font-semibold text-zinc-400">
              Spring Boot MySQL Backend Control & Analytics Plane
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-zinc-300">
              <Server size={14} className="text-emerald-400" />
              <span>Spring Boot: http://localhost:8080</span>
            </div>

            <Link
              to="/dashboard"
              className="flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-3.5 py-2 text-xs font-bold uppercase text-white transition cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Athlete Mode</span>
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}

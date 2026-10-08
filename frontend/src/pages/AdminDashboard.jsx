import { useState } from "react";
import {
  Users,
  Dumbbell,
  Trophy,
  Activity,
  Server,
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  X,
  Edit,
  Power,
} from "lucide-react";
import Button from "../components/Button";

export default function AdminDashboard() {
  // Tab state
  const [activeSection, setActiveSection] = useState("overview"); // "overview" | "users" | "content" | "settings"

  // User Management State
  const [usersList, setUsersList] = useState([
    {
      id: "u_1",
      name: "Alex Vance",
      email: "alex.vance@fitpulse.pro",
      role: "Athlete",
      status: "Active",
      workouts: 68,
      streak: 14,
      joined: "Jan 12, 2026",
    },
    {
      id: "u_2",
      name: "Elena Rostova",
      email: "elena.r@athlete.io",
      role: "Coach",
      status: "Active",
      workouts: 142,
      streak: 24,
      joined: "Jan 05, 2026",
    },
    {
      id: "u_3",
      name: "Marcus Thorne",
      email: "admin@fitpulse.pro",
      role: "System Admin",
      status: "Active",
      workouts: 210,
      streak: 45,
      joined: "Dec 01, 2025",
    },
    {
      id: "u_4",
      name: "David Kim",
      email: "david.kim@iron.fit",
      role: "Athlete",
      status: "Active",
      workouts: 34,
      streak: 9,
      joined: "Feb 02, 2026",
    },
    {
      id: "u_5",
      name: "Chloe Miller",
      email: "chloe.m@running.org",
      role: "Athlete",
      status: "Suspended",
      workouts: 12,
      streak: 0,
      joined: "Feb 18, 2026",
    },
  ]);

  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("All");

  // Add User Modal
  const [addUserModal, setAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("Athlete");

  // System Settings state
  const [apiUrl, setApiUrl] = useState("http://localhost:8080/api");
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("Connected (Simulated Local Engine)");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Content Management: Curated workouts
  const [curatedWorkouts] = useState([
    { id: "cw_1", title: "Olympic Weightlifting Foundation", category: "Strength", level: "Elite", status: "Published" },
    { id: "cw_2", title: "Hyrox Functional Conditioning", category: "HIIT", level: "Advanced", status: "Published" },
    { id: "cw_3", title: "Post-Run Thoracic & Ankle Recovery", category: "Mobility", level: "Beginner", status: "Published" },
  ]);

  // Toast
  const [toastMessage, setToastMessage] = useState("");
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Add User handler
  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const newUser = {
      id: `u_${Date.now()}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      status: "Active",
      workouts: 0,
      streak: 1,
      joined: "Just now",
    };

    setUsersList([newUser, ...usersList]);
    setAddUserModal(false);
    setNewUserName("");
    setNewUserEmail("");
    showToast(`User ${newUser.name} created!`);
  };

  const handleToggleUserStatus = (id) => {
    setUsersList((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" }
          : u
      )
    );
    showToast("User status updated.");
  };

  const handleDeleteUser = (id) => {
    if (window.confirm("Remove this user account permanently?")) {
      setUsersList((prev) => prev.filter((u) => u.id !== id));
      showToast("User account deleted.");
    }
  };

  const handleTestBackendConnection = async () => {
    setTestingConnection(true);
    setConnectionStatus("Pinging Spring Boot Controller...");

    try {
      const res = await fetch(`${apiUrl}/health`).catch(() => null);
      if (res && res.ok) {
        setConnectionStatus("Connected: Spring Boot 3.3 REST Active (200 OK)");
      } else {
        setConnectionStatus("Backend Offline. Operating seamlessly in Mock Mode.");
      }
    } catch {
      setConnectionStatus("Backend Offline. Operating seamlessly in Mock Mode.");
    } finally {
      setTestingConnection(false);
      showToast("Backend connection check complete.");
    }
  };

  // Filtered users
  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === "All" || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-amber-400 px-4 py-3 text-xs font-black text-[#070908] shadow-2xl animate-in slide-in-from-bottom-4">
          <CheckCircle2 size={16} strokeWidth={3} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP ADMIN HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-400 font-bold">
              ROOT MANAGEMENT CLUSTER
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
            System Administration & Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Spring Boot REST Backend Bridge, User Roles, and Global Content Moderation.
          </p>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex rounded-2xl border border-white/10 bg-white/5 p-1 self-start sm:self-auto flex-wrap gap-1">
          {[
            { id: "overview", label: "Overview" },
            { id: "users", label: "Users" },
            { id: "content", label: "Content" },
            { id: "settings", label: "Settings" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                activeSection === tab.id
                  ? "bg-amber-400 text-[#070908] font-black shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. ADMIN OVERVIEW KPIS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-amber-500/20 bg-[#0c100d]/90 p-5">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <Users size={16} className="text-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              Total Users
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white">
            14,820
          </span>
          <p className="text-[10px] text-emerald-400 font-bold mt-1">
            ↑ +184 this week
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0c100d]/90 p-5">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <Activity size={16} className="text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              Daily Active Users
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white">
            3,640
          </span>
          <p className="text-[10px] text-zinc-400 font-medium mt-1">
            24.5% Engagement
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0c100d]/90 p-5">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <Dumbbell size={16} className="text-[#b8ff32]" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              Workouts Logged
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white">
            182,400
          </span>
          <p className="text-[10px] text-zinc-400 font-medium mt-1">
            Total lifetime database rows
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0c100d]/90 p-5">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <Trophy size={16} className="text-purple-400" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              Active Challenges
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white">
            8 Running
          </span>
          <p className="text-[10px] text-zinc-400 font-medium mt-1">
            Community trials
          </p>
        </div>
      </div>

      {/* 2. USER MANAGEMENT SECTION */}
      {(activeSection === "overview" || activeSection === "users") && (
        <div id="users" className="rounded-3xl border border-white/10 bg-[#0a0d0b]/90 p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6">
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                <Users size={18} className="text-amber-400" />
                Athlete & Coach Management
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                View accounts, assign roles, and regulate access
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setAddUserModal(true)}
            >
              Add New User
            </Button>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
              />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search athlete by name or email..."
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
              />
            </div>

            <select
              value={userRoleFilter}
              onChange={(e) => setUserRoleFilter(e.target.value)}
              className="rounded-xl border border-white/10 bg-[#0e120f] py-2.5 px-3 text-xs text-white focus:border-amber-400 focus:outline-none"
            >
              <option value="All">All Roles</option>
              <option value="Athlete">Athlete</option>
              <option value="Coach">Coach</option>
              <option value="System Admin">System Admin</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-[10px] font-black uppercase tracking-wider text-zinc-400">
                <tr>
                  <th className="py-3 px-3">Athlete</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Workouts</th>
                  <th className="py-3 px-3">Streak</th>
                  <th className="py-3 px-3">Joined</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3.5 px-3">
                      <div>
                        <span className="font-bold text-white block">{u.name}</span>
                        <span className="text-[10px] text-zinc-400">{u.email}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider border ${
                          u.role === "System Admin"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : u.role === "Coach"
                            ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                            : "bg-white/5 text-zinc-300 border-white/10"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                          u.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-zinc-300">
                      {u.workouts}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-[#b8ff32]">
                      {u.streak}d
                    </td>
                    <td className="py-3.5 px-3 text-zinc-500 text-[11px]">
                      {u.joined}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleUserStatus(u.id)}
                          className="rounded-lg bg-white/5 hover:bg-white/10 p-1.5 text-zinc-400 hover:text-white transition"
                          title="Toggle Active / Suspended"
                        >
                          <Power size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="rounded-lg bg-rose-500/10 hover:bg-rose-500/20 p-1.5 text-rose-400 transition"
                          title="Delete User"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. CONTENT MANAGEMENT SECTION */}
      {(activeSection === "overview" || activeSection === "content") && (
        <div id="content" className="rounded-3xl border border-white/10 bg-[#0a0d0b]/90 p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6">
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                <Dumbbell size={18} className="text-[#b8ff32]" />
                Curated Fitness Content & Templates
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Manage global workout templates visible across all user libraries
              </p>
            </div>

            <Button
              variant="secondary"
              size="sm"
              icon={Plus}
              onClick={() => showToast("Publishing modal ready")}
            >
              Publish New Template
            </Button>
          </div>

          <div className="space-y-3">
            {curatedWorkouts.map((cw) => (
              <div
                key={cw.id}
                className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#b8ff32]/10 text-[#b8ff32]">
                    <Dumbbell size={16} />
                  </div>
                  <div>
                    <h4 className="font-black text-white">{cw.title}</h4>
                    <span className="text-[10px] text-zinc-400 font-medium">
                      Category: {cw.category} • Level: {cw.level}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 text-[9px] font-bold">
                    {cw.status}
                  </span>
                  <button
                    onClick={() => showToast(`Template ${cw.title} updated.`)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
                  >
                    <Edit size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SYSTEM & SPRING BOOT SETTINGS */}
      {(activeSection === "overview" || activeSection === "settings") && (
        <div id="settings" className="rounded-3xl border border-amber-500/20 bg-[#0a0d0b]/90 p-6 sm:p-8 backdrop-blur-xl">
          <div className="border-b border-white/10 pb-5 mb-6">
            <h2 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
              <Server size={18} className="text-amber-400" />
              Spring Boot REST & MySQL Connectivity
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Configure endpoints and monitor cross-origin database sync
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                  Spring Boot REST Base URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 px-3.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={testingConnection}
                    onClick={handleTestBackendConnection}
                  >
                    {testingConnection ? "Pinging..." : "Test Ping"}
                  </Button>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-400 font-semibold">Status:</span>
                  <span className="font-mono text-emerald-400 font-bold">{connectionStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 font-semibold">MySQL Dialect:</span>
                  <span className="font-mono text-white">MySQL 8.0 InnoDB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 font-semibold">Security Spec:</span>
                  <span className="font-mono text-white">Spring Security 6.0 JWT</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                <div>
                  <span className="text-xs font-bold text-white block">
                    Maintenance Mode
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    Blocks athlete requests while running database migrations
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="h-4 w-4 rounded accent-amber-400 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                <div>
                  <span className="text-xs font-bold text-white block">
                    Flush Session Cache
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    Clear local storage and force refresh of mock payloads
                  </span>
                </div>
                <button
                  onClick={() => {
                    localStorage.clear();
                    showToast("Storage cache cleared.");
                  }}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-zinc-300 hover:text-white"
                >
                  Flush Cache
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD USER MODAL */}
      {addUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-white/15 bg-zinc-950 p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setAddUserModal(false)}
              className="absolute right-6 top-6 text-zinc-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">
              User Creation
            </span>
            <h3 className="text-2xl font-black uppercase text-white mt-1">
              Add Account
            </h3>

            <form onSubmit={handleAddUser} className="mt-5 space-y-4">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Jordan Hayes"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-3.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="jordan@athlete.io"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-3.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                  Assigned Role
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0e120f] py-2.5 px-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                >
                  <option value="Athlete">Athlete</option>
                  <option value="Coach">Coach</option>
                  <option value="System Admin">System Admin</option>
                </select>
              </div>

              <div className="pt-3 flex gap-3">
                <Button type="submit" variant="primary" size="md" className="flex-1">
                  Create User
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => setAddUserModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

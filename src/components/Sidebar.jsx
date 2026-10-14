import { motion } from "motion/react";
import { LayoutDashboard, Code2, FolderKanban, LogOut, Sparkles } from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab, onLogout }) {
  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "skills", label: "Skills", icon: Code2 },
    { id: "projects", label: "Projects", icon: FolderKanban },
  ];

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed left-0 top-0 bottom-0 w-64 border-r border-zinc-800/60 bg-zinc-950/95 backdrop-blur-xl flex flex-col z-50"
    >
      {/* Logo */}
      <div className="px-6 py-6 border-b border-zinc-800/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Sparkles className="w-5 h-5 text-black" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white courgette-regular">Menna's</h2>
            <p className="text-xs text-zinc-500">Portfolio Dashboard</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left ${
                isActive
                  ? "bg-amber-500/15 border border-amber-500/30 text-amber-400"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : ""}`} />
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="active-indicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-zinc-800/60 mt-auto">
        <button
          id="dashboard-logout"
          onClick={onLogout}
          className="w-full group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-zinc-300 hover:text-amber-400 bg-zinc-900/40  border border-zinc-800/70 hover:border-amber-400 transition-all duration-200 active:scale-95"
          title="Sign out of your dashboard"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-800/80 group-hover:bg-amber-500/20 text-zinc-400 group-hover:text-amber-400 flex items-center justify-center transition-colors">
              <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            </div>
            <div className="text-left">
              <span className="block text-xs font-semibold text-zinc-200 group-hover:text-amber-400">
                Log Out
              </span>
             
            </div>
          </div>
          
        </button>
      </div>
    </motion.aside>
  );
}

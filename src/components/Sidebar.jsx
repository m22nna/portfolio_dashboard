import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Code2,
  FolderKanban,
  LogOut,
  Sparkles,
  X,
} from "lucide-react";

/**
 * شريط التنقل الجانبي (Sidebar)
 * - متجاوب بالكامل مع شاشات الموبايل (Drawer مع Backdrop مع إمكانية الإغلاق عند النقر خارجها أو اختيار تبويب)
 * - على الشاشات الكبيرة (lg) يظل ثابتاً ومثبتاً كالمعتاد
 */
export default function Sidebar({
  activeTab,
  setActiveTab,
  onLogout,
  isOpen = false,
  onClose,
}) {
  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "skills", label: "Skills", icon: Code2 },
    { id: "projects", label: "Projects", icon: FolderKanban },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (onClose) onClose();
  };

  const handleLogoutClick = () => {
    if (onClose) onClose();
    onLogout();
  };

  return (
    <>
      {/* خلفية معتمة للموبايل (Backdrop) عند فتح الـ Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* حاوية القائمة الجانبية */}
      <aside
        className={`fixed left-0 top-0 bottom-0 w-64 border-r border-zinc-800/60 bg-zinc-950/95 backdrop-blur-xl flex flex-col z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen
            ? "translate-x-0 shadow-2xl shadow-black/80"
            : "-translate-x-full"
        }`}
      >
        {/* اللوجو + زر الإغلاق على الموبايل */}
        <div className="px-6 py-5 sm:py-6 border-b border-zinc-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white courgette-regular">
                Menna's
              </h2>
              <p className="text-xs text-zinc-500">Portfolio Dashboard</p>
            </div>
          </div>

          {/* زر إغلاق القائمة يظهر فقط على الموبايل */}
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
            title="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* عناصر التنقل (Navigation) */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left ${
                  isActive
                    ? "bg-amber-500/15 border border-amber-500/30 text-amber-400 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 border border-transparent"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-amber-400" : ""}`}
                />
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="w-1.5 h-1.5 rounded-full bg-amber-400"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* زر تسجيل الخروج (Logout) */}
        <div className="p-3 border-t border-zinc-800/60 mt-auto">
          <button
            id="dashboard-logout"
            onClick={handleLogoutClick}
            className="w-full group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-zinc-300 hover:text-amber-400 bg-zinc-900/40 hover:bg-amber-500/10 border border-zinc-800/70 hover:border-amber-400/30 transition-all duration-200 active:scale-95"
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
                <span className="block text-[10px] text-zinc-500 group-hover:text-amber-400/70">
                  End session
                </span>
              </div>
            </div>
            <span className="text-xs text-zinc-600 group-hover:text-amber-400 transition-colors">
              →
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}

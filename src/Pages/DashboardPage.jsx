import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { LogOut } from "lucide-react";
import { supabase } from "../lib/supabase";
import Sidebar from "../components/Sidebar";
import OverviewTab from "../components/OverviewTab";
import SkillsTab from "../components/SkillsTab";
import ProjectsTab from "../components/ProjectsTab";

function mapSkill(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category || "Other",
    color: row.color || "#F59E0B",
    icon: row.icon || "⚡",
  };
}

function mapProject(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description || "",
    tags: Array.isArray(row.technologies)
      ? row.technologies
      : [],
    liveUrl: row.live_url || "",
    githubUrl: row.github_url || "",
    image: row.image_url || "",
    featured: row.featured ?? false,
  };
}

export default function DashboardPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);

  // Authentication + read-only data for Overview.
  useEffect(() => {
    let active = true;

    async function initializeDashboard() {
      try {
        const { data, error } = await supabase.auth.getUser();
        const adminUid = import.meta.env.VITE_ADMIN_USER_ID;

        if (
          error ||
          !data.user ||
          (adminUid && data.user.id !== adminUid)
        ) {
          if (active) {
            navigate("/login", { replace: true });
          }
          return;
        }

        if (!active) return;

        setCheckingAuth(false);

        const [skillsResult, projectsResult] = await Promise.all([
          supabase.from("skills").select("*"),
          supabase.from("projects").select("*"),
        ]);

        if (!active) return;

        if (skillsResult.error) {
          throw skillsResult.error;
        }

        if (projectsResult.error) {
          throw projectsResult.error;
        }

        setSkills((skillsResult.data || []).map(mapSkill));
        setProjects((projectsResult.data || []).map(mapProject));
      } catch (error) {
        if (active) {
          console.error("Dashboard initialization failed:", error);
          setLoadError(
            error.message || "Failed to load dashboard data."
          );
        }
      } finally {
        if (active) {
          setCheckingAuth(false);
          setDataLoading(false);
        }
      }
    }

    initializeDashboard();

    return () => {
      active = false;
    };
  }, [navigate]);

  // Logout.
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
        Checking access...
      </div>
    );
  }

  if (dataLoading && !loadError) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
        Loading your portfolio data...
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            skills={skills}
            projects={projects}
          />
        );

      case "skills":
        return <SkillsTab />;

      case "projects":
        return <ProjectsTab />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* شريط علوي أنيق يحتوي على زر تسجيل الخروج وحالة الآدمن */}
        <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/60 px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">
              Admin Portal
            </span>
            <span className="text-zinc-700">•</span>
            <span className="text-xs font-semibold text-amber-400 capitalize">
              {activeTab}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-300 hover:text-red-400 bg-zinc-900/80 hover:bg-red-500/10 border border-zinc-800 hover:border-red-500/30 transition-all active:scale-95 shadow-sm"
            title="Log out of dashboard"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </header>

        <div className="max-w-5xl w-full mx-auto px-6 py-8 flex-1">
          {loadError && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
            >
              {loadError}

              <button
                onClick={() => setLoadError("")}
                className="ml-3 underline"
              >
                Dismiss
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

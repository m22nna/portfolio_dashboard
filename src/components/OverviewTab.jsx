import { motion } from "motion/react";
import { Code2, FolderKanban, TrendingUp } from "lucide-react";
import Projects from '../components/ProjectsTab'
import Skills from'../components/SkillsTab'
function StatCard({ label, value, icon: Icon, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5 overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 ${color}/5 rounded-full blur-2xl -mr-6 -mt-6`} />
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${color}/15 mb-3`}>
        <Icon className={`w-5 h-5 ${color.replace("bg-", "text-")}`} />
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-zinc-500">{label}</div>
    </motion.div>
  );
}

export default function OverviewTab({ skills, projects }) {
  const avgLevel = skills.length
    ? Math.round(skills.reduce((s, sk) => s + sk.level, 0) / skills.length)
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Welcome back, Menna</h2>
        <p className="text-zinc-400 text-sm">Manage your portfolio content from here.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Skills" value={skills.length} icon={Code2} color="bg-amber-500" />
        <StatCard label="Total Projects" value={projects.length} icon={FolderKanban} color="bg-blue-500" />
        <StatCard label="Avg Skill Level" value={`${avgLevel}%`} icon={TrendingUp} color="bg-green-500" />
      </div>
      <Skills/>
      <Projects/>
    </div>
  );
}

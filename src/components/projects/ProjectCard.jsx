import { motion } from "motion/react";
import { Pencil, Trash2, Star, ExternalLink, Layers, Eye } from "lucide-react";
import { GithubIcon } from "./projectHelpers";

/**
 * كارد المشروع في شبكة المشاريع (Project Card)
 * - الضغط على الكارد يعرض المشروع بالحجم الكامل
 * - تم إزالة الـ Scroll من الـ Description ليكون أنيقاً بـ line-clamp-2
 * - أزرار التعديل والحذف والروابط معزولة بـ e.stopPropagation()
 */
export default function ProjectCard({
  project,
  index = 0,
  onSelect,
  onEdit,
  onDelete,
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
      }}
      onClick={() => onSelect(project)}
      className="relative group rounded-2xl border border-zinc-800/60 bg-zinc-900/40 overflow-hidden hover:border-amber-500/40 hover:bg-zinc-900/70 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* قسم صورة الكارد */}
      <div className="h-44 bg-gradient-to-br from-zinc-800 to-zinc-900 relative overflow-hidden shrink-0">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Layers className="w-12 h-12 text-zinc-700 group-hover:text-zinc-600 transition-colors" />
          </div>
        )}

        {/* شارة Featured */}
        {project.featured && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/90 backdrop-blur-sm text-black text-xs font-bold shadow-md">
            <Star className="w-3 h-3 fill-black" />
            Featured
          </div>
        )}

        {/* أزرار سريعة للتعديل والحذف تظهر عند تمرير الماوس */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            title="Edit Project"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(project);
            }}
            className="p-2 rounded-xl bg-zinc-900/90 backdrop-blur-sm text-zinc-300 hover:text-amber-400 hover:bg-zinc-800 transition-all border border-zinc-700/50"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Delete Project"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project);
            }}
            className="p-2 rounded-xl bg-zinc-900/90 backdrop-blur-sm text-zinc-300 hover:text-red-400 hover:bg-zinc-800 transition-all border border-zinc-700/50"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* تفاصيل الكارد */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="text-white font-bold text-base group-hover:text-amber-400 transition-colors">
              {project.title}
            </h3>
            <span
              className="text-zinc-500 group-hover:text-amber-400 transition-colors shrink-0"
              title="Click to view details"
            >
              <Eye className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </span>
          </div>

          {/* وصف الكارد: سطرين فقط وبدون أي Scrollbar */}
          <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2 mb-4">
            {project.description}
          </p>

          {/* الـ Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.tags.map((tag, tagIdx) => (
                <span
                  key={`${tag}-${tagIdx}`}
                  className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* أسفل الكارد: الروابط وتلميح النقر */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-800/60 mt-auto">
          <div className="flex gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()                  
                }
                className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-amber-400 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-amber-400 transition-colors"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                GitHub
              </a>
            )}
          </div>

          <span className="text-[11px] text-zinc-500 group-hover:text-zinc-400 transition-colors">
            Click to view full details
          </span>
        </div>
      </div>
    </motion.div>
  );
}

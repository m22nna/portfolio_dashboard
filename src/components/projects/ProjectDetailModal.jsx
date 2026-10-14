import { useEffect } from "react";
import { motion } from "motion/react";
import { X, Star, ExternalLink, Pencil, Trash2, Layers } from "lucide-react";
import { GithubIcon } from "./projectHelpers";

/**
 * نافذة عرض تفاصيل المشروع بشكل موسّع وكبير (Project Detail Modal)
 * تُفتح عند الضغط على الكارد لعرض الوصف كاملاً والصورة بالحجم الكبير
 */
export default function ProjectDetailModal({ project, onClose, onEdit, onDelete }) {
  // إغلاق النافذة عند الضغط على زر Esc من الكيبورد
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-2xl rounded-2xl border border-zinc-700/60 bg-zinc-950 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* بانر الصورة العريض للمشروع */}
        <div className="relative w-full h-52 sm:h-64 bg-gradient-to-br from-zinc-800 to-zinc-900 overflow-hidden shrink-0">
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700 bg-zinc-900">
              <Layers className="w-16 h-16 mb-2 text-zinc-700" />
              <span className="text-xs text-zinc-600">
                No Image Uploaded
              </span>
            </div>
          )}

          {/* طبقة تدرج لوني لجعل النص واضحاً */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

          {/* زر الإغلاق */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 hover:bg-black/90 text-zinc-300 hover:text-white border border-white/10 backdrop-blur-md transition-all z-10"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* شارة Featured */}
          {project.featured && (
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-black text-xs font-bold shadow-lg shadow-amber-500/20">
              <Star className="w-3.5 h-3.5 fill-black" />
              Featured Project
            </div>
          )}

          {/* عنوان المشروع أعلى التدرج */}
          <div className="absolute bottom-4 left-6 right-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
              {project.title}
            </h2>
          </div>
        </div>

        {/* محتوى التفاصيل - الوصف كاملاً وبدون أي Scroll مزعج على النص */}
        <div className="p-6 space-y-6 overflow-y-auto no-scrollbar">
          {/* التقنيات المستخدمة */}
          {project.tags && project.tags.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2.5">
                Technologies & Tools
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, idx) => (
                  <span
                    key={`${tag}-${idx}`}
                    className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* الوصف الكامل للمشروع (Full Description) */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2.5">
              Project Description
            </h4>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-zinc-300 text-sm sm:text-base leading-relaxed whitespace-pre-line select-text">
              {project.description || "No description provided."}
            </div>
          </div>

          {/* الروابط المباشرة (Live Demo / GitHub) */}
          {(project.liveUrl || project.githubUrl) && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2.5">
                Project Links
              </h4>
              <div className="flex flex-wrap gap-3">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-black hover:bg-amber-400 font-semibold text-xs sm:text-sm transition-all shadow-md shadow-amber-500/10"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 hover:text-white hover:border-zinc-500 font-medium text-xs sm:text-sm transition-all"
                  >
                    <GithubIcon className="w-4 h-4" />
                    GitHub Repository
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* أسفل النافذة: زر تعديل وحذف وزر إغلاق */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-zinc-900/60 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(project);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-medium border border-zinc-700 transition-all"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit Project
            </button>

            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(project)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800/80 hover:bg-red-500/15 text-zinc-400 hover:text-red-400 text-xs font-medium border border-zinc-700/80 hover:border-red-500/30 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-medium border border-zinc-700 transition-all"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

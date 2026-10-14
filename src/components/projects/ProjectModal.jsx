import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Plus, X, Save, Star, Trash2 } from "lucide-react";
import { normalizeTags } from "./projectHelpers";

/**
 * نافذة إضافة أو تعديل مشروع (Project Modal)
 * تم ضبط التصميم بحيث يختفي أي scroll مزعج، وتكون الحقول متناسقة ومنظمة
 */
export default function ProjectModal({
  project,
  onClose,
  onSave,
  saving,
}) {
  const [form, setForm] = useState(
    project || {
      title: "",
      description: "",
      tags: [],
      liveUrl: "",
      githubUrl: "",
      image: "",
      featured: false,
    }
  );

  const [tagInput, setTagInput] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // إنشاء معاينة سريعة للصورة المختارة
  useEffect(() => {
    if (!imageFile) {
      setImagePreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  // إضافة Tag جديد
  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !form.tags.includes(trimmed)) {
      setForm((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmed],
      }));
    }
    setTagInput("");
  };

  // إرسال البيانات للحفظ
  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim() || saving) {
      return;
    }

    const success = await onSave({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      tags: normalizeTags(form.tags),
      imageFile,
    });

    if (success) {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md px-4 py-4 sm:py-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-xl rounded-2xl border border-zinc-700/60 bg-zinc-950 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
      >
        {/* رأس النافذة (Header) */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-zinc-800/80 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <h3 className="text-white font-semibold text-base">
              {project ? "Edit Project" : "Add New Project"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* جسم النافذة (Body) - Scroll مخفي بتصميم مضغوط وأنيق */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto no-scrollbar">
          {/* العنوان + خيار Featured */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Project Title *
              </label>
              <input
                id="project-title-input"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="e.g. Tareeqy Platform"
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all"
              />
            </div>

            <div
              onClick={() =>
                setForm((f) => ({ ...f, featured: !f.featured }))
              }
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border cursor-pointer select-none transition-all ${
                form.featured
                  ? "bg-amber-500/10 border-amber-500/40 text-amber-300"
                  : "bg-zinc-900 border-zinc-700/80 text-zinc-400 hover:border-zinc-600"
              }`}
            >
              <Star
                className={`w-4 h-4 ${
                  form.featured
                    ? "fill-amber-400 text-amber-400"
                    : "text-zinc-500"
                }`}
              />
              <span className="text-xs font-medium whitespace-nowrap">
                Featured
              </span>
            </div>
          </div>

          {/* الوصف (Description) */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
              Description *
            </label>
            <textarea
              id="project-description-input"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Describe your project, technologies used, challenges solved..."
              rows={3}
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all resize-none leading-relaxed overflow-y-auto scrollbar-none"
            />
          </div>

          {/* التقنيات (Tags / Technologies) */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
              Tags / Technologies
            </label>
            <div className="flex gap-2 mb-2">
              <input
                id="project-tag-input"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                placeholder="Type tag & press Enter (e.g. React, Node.js)..."
                className="flex-1 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-all"
              />
              <button
                id="project-add-tag-btn"
                type="button"
                onClick={addTag}
                className="px-3.5 py-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 text-sm hover:bg-amber-500/30 transition-all font-medium flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar">
                {form.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          tags: f.tags.filter((t) => t !== tag),
                        }))
                      }
                      className="hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* الروابط (Live Demo + GitHub) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Live URL
              </label>
              <input
                id="project-live-url-input"
                value={form.liveUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, liveUrl: e.target.value }))
                }
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                GitHub URL
              </label>
              <input
                id="project-github-url-input"
                value={form.githubUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, githubUrl: e.target.value }))
                }
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-all"
              />
            </div>
          </div>

          {/* صورة المشروع (Project Image) */}
          <div>
            <label
              htmlFor="project-image-input"
              className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5"
            >
              Project Image (optional)
            </label>

            <div className="flex items-center gap-3">
              {(imagePreview || form.image) && (
                <div className="relative w-16 h-16 rounded-xl border border-zinc-700 bg-zinc-900 overflow-hidden shrink-0 group">
                  <img
                    src={imagePreview || form.image}
                    alt="Project preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setForm((f) => ({ ...f, image: "" }));
                    }}
                    title="Remove image"
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-400 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="flex-1">
                <input
                  id="project-image-input"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const allowedTypes = [
                      "image/jpeg",
                      "image/png",
                      "image/webp",
                    ];
                    if (!allowedTypes.includes(file.type)) {
                      setImageFile(null);
                      e.target.value = "";
                      window.alert(
                        "Please choose a JPG, PNG, or WebP image."
                      );
                      return;
                    }

                    if (file.size > 5 * 1024 * 1024) {
                      setImageFile(null);
                      e.target.value = "";
                      window.alert("Image size must be 5 MB or less.");
                      return;
                    }

                    setImageFile(file);
                  }}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs file:mr-3 file:px-3 file:py-2 file:border-0 file:bg-amber-500/20 file:text-amber-400 hover:file:bg-amber-500/30 transition-all cursor-pointer"
                />
                <p className="mt-1 text-[11px] text-zinc-500">
                  JPG, PNG, or WebP — max 5 MB
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* أزرار الإجراءات في أسفل النافذة (Footer) */}
        <div className="flex gap-3 px-6 py-4 border-t border-zinc-800/80 bg-zinc-900/50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-sm hover:text-zinc-200 hover:border-zinc-600 transition-all"
          >
            Cancel
          </button>
          <button
            id="project-save-btn"
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-amber-500 text-black font-semibold text-sm hover:bg-amber-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {saving
              ? "Saving..."
              : project
                ? "Update Project"
                : "Add Project"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

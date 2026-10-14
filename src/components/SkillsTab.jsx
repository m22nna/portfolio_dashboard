import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {  Plus,  Pencil,  Trash2,  X,  Save,  Code2,} from "lucide-react";
import { supabase } from "../lib/supabase";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const COLOR_PRESETS = [
  "#61DAFB","#F7DF1E","#38BDF8","#339933","#F05032","#F59E0B","#8B5CF6","#EC4899","#EF4444","#10B981",];

function mapSkill(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category || "Other",
    color: row.color || "#F59E0B",
    icon: row.icon || "⚡",
  };
}

// SKILL FORM MODAL
function SkillModal({ skill, onClose, onSave, saving }) {
  const [form, setForm] = useState(
    skill || {
      name: "",
      category: "Frontend",
      color: "#F59E0B",
      icon: "⚡",
    }
  );

  const categories = [
    "Frontend","Backend","Language","Styling","Tools","Database","Other",
  ];

  const handleSave = async () => {
    if (!form.name.trim() || saving) return;

    const success = await onSave({
      ...form,
      name: form.name.trim(),
      icon: form.icon || "⚡",
    });

    // Close only after Supabase confirms success.
    if (success) {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md px-4 py-6"
      onClick={(e) =>
        e.target === e.currentTarget && onClose()
      }
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-md rounded-2xl border border-zinc-800/80 bg-zinc-950 shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 shrink-0">
          <h3 className="text-white font-semibold text-base">
            {skill ? "Edit Skill" : "Add New Skill"}
          </h3>

          <button type="button" onClick={onClose} className="text-zinc-500 hover:text-zinc-200 transition-colors" >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
              Skill Name *
            </label>

            <input
              id="skill-name-input"
              value={form.name}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  name: e.target.value,
                }))
              }
              placeholder="e.g. React.js"
              autoFocus className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
              Category
            </label>

            <select
              id="skill-category-select"
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  category: e.target.value,
                }))
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-all cursor-pointer"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Color Accent
            </label>

            <div className="flex flex-wrap items-center gap-2">
              {COLOR_PRESETS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() =>
                    setForm((f) => ({ ...f, color }))
                  }
                  className={`w-7 h-7 rounded-lg transition-transform hover:scale-110 ${
                    form.color?.toLowerCase() === color.toLowerCase()
                      ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-950 scale-110"
                      : "opacity-80 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}

              <div className="flex items-center gap-2 ml-1">
                <input
                  id="skill-color-input"
                  type="color"
                  value={form.color || "#F59E0B"}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      color: e.target.value,
                    }))
                  }
                  className="w-7 h-7 rounded-lg border border-zinc-700 bg-zinc-900 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-6 pb-6 pt-3 shrink-0 border-t border-zinc-800/60">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-sm hover:text-zinc-200 hover:border-zinc-600 transition-all"
          >
            Cancel
          </button>

          <button
            id="skill-save-btn"
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-amber-500 text-black font-semibold text-sm hover:bg-amber-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {saving
              ? "Saving..."
              : skill
                ? "Update Skill"
                : "Add Skill"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// SKILLS COMPONENT
export default function SkillsTab() {
  const [skills, setSkills] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [skillToDelete, setSkillToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchSkills() {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("skills")
        .select("*");

      if (!active) return;

      if (error) {
        setError(`Could not load skills: ${error.message}`);
      } else {
        setSkills((data || []).map(mapSkill));
      }

      setLoading(false);
    }

    fetchSkills();

    return () => {
      active = false;
    };
  }, []);

  const addSkill = async (form) => {
    setSaving(true);
    setError("");

    try {
      const { data, error } = await supabase
        .from("skills")
        .insert({
          name: form.name.trim(),
          category: form.category || "Other",
          color: form.color || "#F59E0B",
          icon: form.icon || "⚡",
        })
        .select()
        .single();

      if (error) throw error;

      setSkills((previous) => [...previous, mapSkill(data)]);
      setEditingSkill(null);
      setShowModal(false);

      return true;
    } catch (error) {
      setError(`Could not add skill: ${error.message}`);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updateSkill = async (id, form) => {
    setSaving(true);
    setError("");

    try {
      const { data, error } = await supabase
        .from("skills")
        .update({
          name: form.name.trim(),
          category: form.category || "Other",
          color: form.color || "#F59E0B",
          icon: form.icon || "⚡",
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setSkills((previous) =>
        previous.map((skill) =>
          skill.id === id ? mapSkill(data) : skill
        )
      );

      setEditingSkill(null);
      setShowModal(false);

      return true;
    } catch (error) {
      setError(`Could not update skill: ${error.message}`);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteSkill = async (id) => {
    setDeleting(true);
    setError("");

    const { error } = await supabase
      .from("skills")
      .delete()
      .eq("id", id);

    if (error) {
      setError(`Could not delete skill: ${error.message}`);
      setDeleting(false);
      return;
    }

    setSkills((previous) =>
      previous.filter((skill) => skill.id !== id)
    );
    setDeleting(false);
    setSkillToDelete(null);
  };

  const handleSave = async (form) => {
    if (editingSkill) {
      return updateSkill(editingSkill.id, form);
    }

    return addSkill(form);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Skills</h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-0.5">
            {skills.length} skills added
          </p>
        </div>

        <button
          id="add-skill-btn"
          onClick={() => {
            setEditingSkill(null);
            setShowModal(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-black font-semibold text-sm hover:bg-amber-400 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-amber-500/20 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Add Skill
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
        >
          {error}
          <button
            type="button"
            onClick={() => setError("")}
            className="ml-3 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {loading ? (
        <p className="py-8 text-center text-sm text-zinc-400">
          Loading skills...
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {skills.map((skill, i) => (
              <motion.div
                key={skill.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
                className="relative group rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5 hover:border-amber-500/30 transition-all duration-300 min-h-[150px] flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-transform duration-300 group-hover:scale-105"
                    style={{
                      backgroundColor: `${skill.color || "#F59E0B"}15`,
                    }}
                  >
                    {skill.icon ? (
                      skill.icon
                    ) : (
                      <Code2
                        className="w-5 h-5"
                        style={{
                          color: skill.color || "#F59E0B",
                        }}
                      />
                    )}
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSkill(skill);
                        setShowModal(true);
                      }}
                      className="p-2 rounded-xl text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 transition-all"
                      title="Edit Skill"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setSkillToDelete(skill)}
                      className="p-2 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-all"
                      title="Delete Skill"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-white font-bold text-base mb-1.5 group-hover:text-amber-400 transition-colors">
                    {skill.name}
                  </h3>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400 bg-zinc-800/60 px-2.5 py-1 rounded-lg">
                      {skill.category}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: skill.color || "#F59E0B",
                        }}
                      />
                      <span className="text-[11px] text-zinc-500">
                        {skill.category}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* نافذة الإضافة والتعديل */}
      <AnimatePresence>
        {showModal && (
          <SkillModal
            skill={editingSkill}
            saving={saving}
            onClose={() => {
              setShowModal(false);
              setEditingSkill(null);
            }}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>

      {/* نافذة تأكيد الحذف */}
      <AnimatePresence>
        {skillToDelete && (
          <ConfirmDeleteModal
            title="Delete Skill"
            itemName={skillToDelete.name}
            loading={deleting}
            onClose={() => setSkillToDelete(null)}
            onConfirm={() => deleteSkill(skillToDelete.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}



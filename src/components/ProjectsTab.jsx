import { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";
import { supabase } from "../lib/supabase";

// استيراد المكونات الفرعية المقسمة
import ProjectCard from "./projects/ProjectCard";
import ProjectModal from "./projects/ProjectModal";
import ProjectDetailModal from "./projects/ProjectDetailModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import {
  mapProject,
  uploadProjectImage,
  deleteProjectImageByUrl,
} from "./projects/projectHelpers";

export default function ProjectsTab() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // جلب المشاريع من Supabase
  useEffect(() => {
    let active = true;

    async function fetchProjects() {
      setLoading(true);
      setError("");

      const { data, error: fetchErr } = await supabase
        .from("projects")
        .select("*");

      if (!active) return;

      if (fetchErr) {
        setError(`Could not load projects: ${fetchErr.message}`);
      } else {
        setProjects((data || []).map(mapProject));
      }
      setLoading(false);
    }

    fetchProjects();

    return () => {
      active = false;
    };
  }, []);

  // إضافة مشروع جديد
  const addProject = async (form) => {
    setSaving(true);
    setError("");
    let uploadedImageUrl = null;

    try {
      let imageUrl = form.image || "";
      if (form.imageFile) {
        uploadedImageUrl = await uploadProjectImage(form.imageFile);
        imageUrl = uploadedImageUrl;
      }

      const { data, error: insertErr } = await supabase
        .from("projects")
        .insert({
          title: form.title.trim(),
          description: form.description.trim(),
          technologies: form.tags,
          live_url: form.liveUrl || "",
          github_url: form.githubUrl || "",
          image_url: imageUrl,
          featured: Boolean(form.featured),
        })
        .select()
        .single();

      if (insertErr) throw insertErr;

      setProjects((prev) => [...prev, mapProject(data)]);
      setShowModal(false);
      setEditingProject(null);
      return true;
    } catch (err) {
      if (uploadedImageUrl) {
        try {
          await deleteProjectImageByUrl(uploadedImageUrl);
        } catch (cleanupErr) {
          console.error("Could not clean up uploaded image:", cleanupErr);
        }
      }
      setError(`Could not add project: ${err.message}`);
      return false;
    } finally {
      setSaving(false);
    }
  };

  // تعديل مشروع حالي
  const updateProject = async (id, form) => {
    setSaving(true);
    setError("");
    let uploadedImageUrl = null;
    let databaseUpdated = false;

    try {
      const oldImageUrl = projects.find((p) => p.id === id)?.image;

      let imageUrl = form.image || "";
      if (form.imageFile) {
        uploadedImageUrl = await uploadProjectImage(form.imageFile);
        imageUrl = uploadedImageUrl;
      }

      const { data, error: updateErr } = await supabase
        .from("projects")
        .update({
          title: form.title.trim(),
          description: form.description.trim(),
          technologies: form.tags,
          live_url: form.liveUrl || "",
          github_url: form.githubUrl || "",
          image_url: imageUrl,
          featured: Boolean(form.featured),
        })
        .eq("id", id)
        .select()
        .single();

      if (updateErr) throw updateErr;
      databaseUpdated = true;

      const updated = mapProject(data);
      setProjects((prev) =>
        prev.map((project) => (project.id === id ? updated : project))
      );

      // تحديث نافذة التفاصيل إذا كانت مفتوحة لنفس المشروع
      if (selectedProject?.id === id) {
        setSelectedProject(updated);
      }

      // حذف الصورة القديمة بعد نجاح التحديث
      if (uploadedImageUrl && oldImageUrl) {
        try {
          await deleteProjectImageByUrl(oldImageUrl);
        } catch (cleanupErr) {
          console.error("Could not delete old image:", cleanupErr);
        }
      }

      setShowModal(false);
      setEditingProject(null);
      return true;
    } catch (err) {
      if (uploadedImageUrl && !databaseUpdated) {
        try {
          await deleteProjectImageByUrl(uploadedImageUrl);
        } catch (cleanupErr) {
          console.error("Could not clean up uploaded image:", cleanupErr);
        }
      }
      setError(`Could not update project: ${err.message}`);
      return false;
    } finally {
      setSaving(false);
    }
  };

  // حذف مشروع
  const deleteProject = async (id) => {
    setDeleting(true);
    setError("");
    const { error: deleteErr } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);

    if (deleteErr) {
      setError(`Could not delete project: ${deleteErr.message}`);
      setDeleting(false);
      return;
    }

    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (selectedProject?.id === id) {
      setSelectedProject(null);
    }
    setDeleting(false);
    setProjectToDelete(null);
  };

  // معالج الحفظ المشترك (إضافة أو تعديل)
  const handleSave = async (form) => {
    if (editingProject) {
      return updateProject(editingProject.id, form);
    }
    return addProject(form);
  };

  return (
    <div className="space-y-6">
      {/* الشريط العلوي: العنوان وزر الإضافة */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Projects</h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-0.5">
            {projects.length} {projects.length === 1 ? "project" : "projects"} added
          </p>
        </div>
        <button
          id="add-project-btn"
          onClick={() => {
            setEditingProject(null);
            setShowModal(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-black font-semibold text-sm hover:bg-amber-400 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-amber-500/20 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {/* رسالة الخطأ إن وجدت */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300 flex items-center justify-between"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError("")}
            className="underline ml-3 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* قائمة المشاريع */}
      {loading ? (
        <p className="py-8 text-center text-sm text-zinc-400">
          Loading projects...
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <AnimatePresence>
            {projects.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                onSelect={(proj) => setSelectedProject(proj)}
                onEdit={(proj) => {
                  setEditingProject(proj);
                  setShowModal(true);
                }}
                onDelete={(proj) => setProjectToDelete(proj)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* نافذة الإضافة والتعديل */}
      <AnimatePresence>
        {showModal && (
          <ProjectModal
            project={editingProject}
            saving={saving}
            onClose={() => {
              setShowModal(false);
              setEditingProject(null);
            }}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>

      {/* نافذة العرض التفصيلي للمشروع بالحجم الكبير */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            onEdit={(proj) => {
              setSelectedProject(null);
              setEditingProject(proj);
              setShowModal(true);
            }}
            onDelete={(proj) => {
              setProjectToDelete(proj);
            }}
          />
        )}
      </AnimatePresence>

      {/* نافذة تأكيد الحذف */}
      <AnimatePresence>
        {projectToDelete && (
          <ConfirmDeleteModal
            title="Delete Project"
            itemName={projectToDelete.title}
            loading={deleting}
            onClose={() => setProjectToDelete(null)}
            onConfirm={() => deleteProject(projectToDelete.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

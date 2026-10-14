import { supabase } from "../../lib/supabase";

export const PROJECT_IMAGES_BUCKET = "project-images";

// رفع صورة المشروع إلى Supabase Storage
export async function uploadProjectImage(file) {
  if (!file) return null;

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Please upload a JPG, PNG, or WebP image.");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image size must be 5 MB or less.");
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const filePath = `projects/${crypto.randomUUID()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from(PROJECT_IMAGES_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from(PROJECT_IMAGES_BUCKET)
    .getPublicUrl(filePath);
  return data.publicUrl;
}

// حذف صورة المشروع القديمة من Supabase Storage
export async function deleteProjectImageByUrl(publicUrl) {
  if (!publicUrl) return;

  const marker = `/storage/v1/object/public/${PROJECT_IMAGES_BUCKET}/`;
  const markerIndex = publicUrl.indexOf(marker);
  if (markerIndex === -1) return;

  const encodedPath = publicUrl
    .slice(markerIndex + marker.length)
    .split("?")[0];

  let filePath;
  try {
    filePath = decodeURIComponent(encodedPath);
  } catch {
    filePath = encodedPath;
  }

  const { error } = await supabase.storage
    .from(PROJECT_IMAGES_BUCKET)
    .remove([filePath]);
  if (error) throw error;
}

// تحويل بيانات المشروع القادمة من قاعدة البيانات إلى صيغة موحدة
export function mapProject(row) {
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

// تنظيف وتنسيق الـ Tags
export function normalizeTags(tags) {
  if (Array.isArray(tags)) {
    return tags
      .map((tag) => String(tag).trim())
      .filter(Boolean);
  }
  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return [];
}

// أيقونة GitHub
export const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

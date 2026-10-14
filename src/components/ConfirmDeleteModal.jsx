import { useEffect } from "react";
import { motion } from "motion/react";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";

/**
 * نافذة تأكيد الحذف المشتركة (Confirm Delete Modal)
 * تُستخدم لتأكيد حذف المشاريع أو المهارات بشكل أنيق ومميز بدلاً من confirm() الافتراضية
 */
export default function ConfirmDeleteModal({
  title = "Delete Item",
  itemName = "",
  message,
  onClose,
  onConfirm,
  loading = false,
}) {
  // إغلاق النافذة عند الضغط على زر Esc
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !loading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, loading]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md px-4 py-6"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-md rounded-2xl border border-red-500/20 bg-zinc-950 shadow-2xl overflow-hidden p-6"
      >
        {/* توهج خلفي أحمر خفيف */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* زر الإغلاق X */}
        <button
          type="button"
          disabled={loading}
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>

        {/* أيقونة التحذير + المحتوى */}
        <div className="flex flex-col items-center sm:items-start sm:flex-row gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>

          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="text-lg font-bold text-white tracking-tight">
              {title}
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {message || (
                <>
                  Are you sure you want to delete{" "}
                  {itemName ? (
                    <span className="font-semibold text-white">
                      "{itemName}"
                    </span>
                  ) : (
                    "this item"
                  )}
                  ? This action cannot be undone.
                </>
              )}
            </p>
          </div>
        </div>

        {/* أزرار الإجراءات (Cancel / Delete) */}
        <div className="flex items-center gap-3 justify-end pt-2 border-t border-zinc-800/80">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 text-sm font-medium hover:text-white hover:bg-zinc-800/80 hover:border-zinc-600 transition-all disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            id="confirm-delete-btn"
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-all shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

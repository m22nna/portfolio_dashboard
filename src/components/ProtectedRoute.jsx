import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "../lib/supabase";

/**
 * ProtectedRoute: حماية مسار الداشبورد
 * - يتحقق من وجود جلسة دخول نشطة ومطابقتها لحساب الآدمن
 * - يمنع أي وميض أو طرد عشوائي عند عمل Refresh للصفحة
 */
export default function ProtectedRoute() {
  const [status, setStatus] = useState("checking"); // "checking" | "authorized" | "unauthorized"

  useEffect(() => {
    let mounted = true;
    const adminUid = import.meta.env.VITE_ADMIN_USER_ID;

    async function checkAuth() {
      try {
        const { data, error } = await supabase.auth.getSession();
        const session = data?.session;

        if (error || !session?.user) {
          if (mounted) setStatus("unauthorized");
          return;
        }

        const user = session.user;
        // التحقق من حساب الآدمن
        if (adminUid && user.id !== adminUid) {
          if (mounted) setStatus("unauthorized");
          return;
        }

        if (mounted) setStatus("authorized");
      } catch (err) {
        console.error("Auth check failed:", err);
        if (mounted) setStatus("unauthorized");
      }
    }

    checkAuth();

    // الاستماع لأي تغيير في حالة تسجيل الدخول / الخروج
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === "SIGNED_OUT") {
        setStatus("unauthorized");
      } else if (
        event === "SIGNED_IN" ||
        event === "TOKEN_REFRESHED" ||
        event === "USER_UPDATED"
      ) {
        if (session?.user && (!adminUid || session.user.id === adminUid)) {
          setStatus("authorized");
        } else {
          setStatus("unauthorized");
        }
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  if (status === "checking") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-400 gap-3">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium text-zinc-400">Verifying access...</span>
      </div>
    );
  }

  if (status === "unauthorized") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
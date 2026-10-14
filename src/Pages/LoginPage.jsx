import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Lock, User, Eye, EyeOff, Shield, Sparkles } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function LoginPage() {
  const navigate = useNavigate();
 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  // إذا كان المستخدم مسجل دخوله بالفعل كـ Admin، يتم توجيهه مباشرة للداشبورد
  useEffect(() => {
    let mounted = true;
    const adminUid = import.meta.env.VITE_ADMIN_USER_ID;

    async function checkExistingSession() {
      const { data } = await supabase.auth.getSession();
      const session = data?.session;
      if (session?.user && (!adminUid || session.user.id === adminUid)) {
        if (mounted) {
          navigate("/dashboard", { replace: true });
        }
      }
    }

    checkExistingSession();

    return () => {
      mounted = false;
    };
  }, [navigate]);

const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");
  setLoading(true);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: username.trim(),
    password,
  });

  setLoading(false);

  if (error) {
    setError("Invalid email or password.");
    setShake(true);
    setTimeout(() => setShake(false), 600);
    return;
  }

  // Verify that the signed-in account is the designated admin.
  const adminUid = import.meta.env.VITE_ADMIN_USER_ID;

  if (!adminUid || data.user?.id !== adminUid) {
    await supabase.auth.signOut();
    setError("You are not authorized to access this dashboard.");
    return;
  }

  navigate("/dashboard", { replace: true });
};



  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(245,158,11,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`relative w-full max-w-md mx-4 ${shake ? "animate-shake" : ""}`}
      >
        {/* Card */}
        <div className="relative rounded-3xl border border-amber-500/20 bg-zinc-950/80 backdrop-blur-xl shadow-2xl shadow-amber-500/5 overflow-hidden">
          {/* Top accent line */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

          <div className="p-8 sm:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-white courgette-regular"
              >
                Dashboard{" "}
                <span className="bg-gradient-to-r from-amber-300 to-yellow-500 bg-clip-text text-transparent">
                  Login
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-zinc-400 text-sm mt-2"
              >
                Sign in to manage your portfolio content
              </motion.p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-xs font-semibold text-amber-400/80 uppercase tracking-widest mb-2">
                  Email
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    id="login-username"
                    type="email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200"
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-xs font-semibold text-amber-400/80 uppercase tracking-widest mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-10 pr-12 py-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-amber-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <button
                  id="login-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold text-base hover:from-amber-400 hover:to-yellow-400 transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-black border-t-transparent rounded-full"
                      />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      
                     Submit
                    </>
                  )}
                </button>
              </motion.div>
            </form>

           
          </div>
        </div>
      </motion.div>

      
    </div>
  );
}

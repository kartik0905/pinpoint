import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme === "dark" || !savedTheme; // Default to dark

    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const user = params.get("user");

    if (token && user) {
      try {
        const userData = JSON.parse(decodeURIComponent(user));
        login(token, userData);
        setTimeout(() => navigate("/dashboard"), 100);
      } catch (err) {
        console.error("Auth callback error:", err);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [login, navigate]);

  return (
    <div className="min-h-screen bg-indigo-50/50 dark:bg-zinc-900 flex items-center justify-center transition-colors duration-500 relative overflow-hidden font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute top-[20%] left-[30%] w-[500px] h-[500px] bg-gradient-to-b from-cyan-400/20 to-purple-400/20 dark:from-cyan-500/10 dark:to-purple-600/10 blur-[100px] rounded-full pointer-events-none -z-10 transition-colors duration-500"></div>

      <div className="text-center bg-white dark:bg-zinc-800/40 backdrop-blur-xl border border-white dark:border-zinc-700/50 p-8 rounded-3xl shadow-2xl shadow-indigo-200/50 dark:shadow-none transition-colors duration-500">
        <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-bold text-zinc-900 dark:text-white transition-colors duration-500">
          Authenticating...
        </p>
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1 transition-colors duration-500">
          Preparing your workspace
        </p>
      </div>
    </div>
  );
}

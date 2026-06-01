import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme === "dark" || !savedTheme; // Default to dark

    const html = document.documentElement;
    const body = document.body;

    if (isDark) {
      html.classList.add("dark");
      html.style.backgroundColor = "#0e1015";
      body.style.backgroundColor = "#0e1015";
      html.style.colorScheme = "dark";
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      html.style.backgroundColor = "#ffffff";
      body.style.backgroundColor = "#ffffff";
      html.style.colorScheme = "light";
      localStorage.setItem("theme", "light");
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
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0e1015] flex items-center justify-center transition-colors duration-500 relative overflow-hidden font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute top-[20%] left-[30%] w-[500px] h-[500px] bg-gradient-to-br from-red-500/10 to-orange-500/10 dark:from-red-600/20 dark:to-orange-600/20 blur-[100px] rounded-full pointer-events-none -z-10 transition-colors duration-500"></div>

      <div className="text-center bg-white dark:bg-[#15171e] border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-none transition-colors duration-500">
        <div className="w-10 h-10 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm font-extrabold text-zinc-900 dark:text-white transition-colors duration-500 tracking-tight">
          Authenticating...
        </p>
        <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mt-1 transition-colors duration-500">
          Preparing your workspace
        </p>
      </div>
    </div>
  );
}

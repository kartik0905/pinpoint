import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const user = params.get("user");

    if (token && user) {
      try {
        const userData = JSON.parse(decodeURIComponent(user));
        login(token, userData);
        // Small delay to let AuthContext update before redirecting
        setTimeout(() => navigate("/"), 100);
      } catch (err) {
        console.error("Auth callback error:", err);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-500 text-sm">Signing you in...</p>
      </div>
    </div>
  );
}

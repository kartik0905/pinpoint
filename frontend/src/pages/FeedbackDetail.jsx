import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

export default function FeedbackDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : true;
  });

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (isDarkMode) {
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
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  useEffect(() => {
    fetchFeedback();
  }, [id]);

  const fetchFeedback = async () => {
    try {
      const res = await API.get(`/feedback/single/${id}`);
      setFeedback(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load feedback details");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status) => {
    try {
      await API.patch(`/feedback/${id}`, { status });
      setFeedback({ ...feedback, status });
      toast.success(`Marked as ${status}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#0e1015] flex items-center justify-center transition-colors duration-500">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400">
            Loading details...
          </p>
        </div>
      </div>
    );

  if (!feedback)
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#0e1015] flex items-center justify-center transition-colors duration-500">
        <div className="text-center bg-white dark:bg-[#15171e] border border-zinc-200 dark:border-zinc-800 p-8 rounded-xl shadow-sm">
          <div className="w-12 h-12 bg-red-50 dark:bg-[#0e1015] text-red-500 border border-red-100 dark:border-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white mb-2">
            Feedback not found
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-red-600 dark:text-red-400 font-bold hover:underline"
          >
            Return to project
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0e1015] text-zinc-900 dark:text-zinc-300 font-sans transition-colors duration-500 relative overflow-hidden selection:bg-red-500/30">
      {/* Ambient Glows */}
      <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-gradient-to-br from-red-500/10 to-orange-500/10 dark:from-red-600/10 dark:to-orange-600/10 blur-[100px] rounded-full pointer-events-none -z-10 transition-colors duration-500"></div>

      {/* Navbar */}
      <nav className="bg-white/80 dark:bg-[#0e1015]/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors group px-3 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 shadow-sm dark:shadow-none font-bold"
            >
              <svg
                className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span className="text-sm hidden sm:block">Back</span>
            </button>
            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 transition-colors duration-500"></div>
            <h1 className="text-lg font-extrabold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2 transition-colors duration-500">
              <svg
                className="w-5 h-5 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              Issue Inspector
            </h1>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all focus:outline-none"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Visual Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-[#15171e] border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm transition-colors duration-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2 transition-colors duration-500">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Visual Context
                </h3>
              </div>

              {feedback.screenshot ? (
                <div className="bg-zinc-50 dark:bg-[#0e1015] rounded-lg p-2 border border-zinc-200 dark:border-zinc-800 transition-colors duration-500">
                  <img
                    src={feedback.screenshot}
                    alt="Feedback screenshot"
                    className="w-full rounded-md"
                  />
                </div>
              ) : (
                <div className="bg-zinc-50 dark:bg-[#0e1015] rounded-lg h-64 flex flex-col items-center justify-center border border-dashed border-zinc-300 dark:border-zinc-800 transition-colors duration-500">
                  <svg
                    className="w-10 h-10 text-zinc-400 dark:text-zinc-600 mb-3 transition-colors duration-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm font-bold text-zinc-500 dark:text-zinc-500 transition-colors duration-500">
                    No screenshot attached
                  </span>
                </div>
              )}
            </div>

            {/* User Comment */}
            {feedback.comment && (
              <div className="bg-white dark:bg-[#15171e] border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm transition-colors duration-500">
                <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-3 transition-colors duration-500">
                  User Comment
                </h3>
                <div className="bg-zinc-50 dark:bg-[#0e1015] rounded-md p-5 border border-zinc-200 dark:border-zinc-800 transition-colors duration-500">
                  <p className="text-lg text-zinc-800 dark:text-zinc-200 leading-relaxed font-bold tracking-tight transition-colors duration-500">
                    "{feedback.comment}"
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Metadata & Actions */}
          <div className="space-y-6">
            {/* Status Control */}
            <div className="bg-white dark:bg-[#15171e] border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm transition-colors duration-500">
              <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-4 transition-colors duration-500">
                Resolution Status
              </h3>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div
                  className={`flex-1 w-full text-center py-2.5 rounded-md text-sm font-bold border transition-colors ${
                    feedback.status === "open"
                      ? "bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20 text-yellow-700 dark:text-yellow-400"
                      : "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${feedback.status === "open" ? "bg-yellow-500" : "bg-emerald-500"}`}
                    ></span>
                    {feedback.status.toUpperCase()}
                  </span>
                </div>

                <button
                  onClick={() =>
                    updateStatus(
                      feedback.status === "open" ? "resolved" : "open",
                    )
                  }
                  className={`w-full sm:w-auto px-5 py-2.5 rounded-md text-sm font-bold transition-all shadow-sm ${
                    feedback.status === "open"
                      ? "bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 border border-zinc-900 dark:border-white"
                      : "bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700"
                  }`}
                >
                  {feedback.status === "open"
                    ? "Mark Resolved"
                    : "Reopen Issue"}
                </button>
              </div>
            </div>

            {/* Environment Details */}
            <div className="bg-white dark:bg-[#15171e] border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm transition-colors duration-500">
              <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-5 transition-colors duration-500">
                Environment Details
              </h3>

              <div className="space-y-4">
                <div className="bg-zinc-50 dark:bg-[#0e1015] rounded-md p-4 border border-zinc-200 dark:border-zinc-800 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <svg
                      className="w-4 h-4 text-zinc-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                    <p className="text-xs font-bold text-zinc-500 dark:text-zinc-500 transition-colors duration-500">
                      Page URL
                    </p>
                  </div>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white break-all transition-colors duration-500">
                    {feedback.url || "—"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-50 dark:bg-[#0e1015] rounded-md p-4 border border-zinc-200 dark:border-zinc-800 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <svg
                        className="w-4 h-4 text-zinc-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-xs font-bold text-zinc-500 dark:text-zinc-500 transition-colors duration-500">
                        Device
                      </p>
                    </div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white transition-colors duration-500">
                      {feedback.device || "—"}
                    </p>
                  </div>

                  <div className="bg-zinc-50 dark:bg-[#0e1015] rounded-md p-4 border border-zinc-200 dark:border-zinc-800 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <svg
                        className="w-4 h-4 text-zinc-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-xs font-bold text-zinc-500 dark:text-zinc-500 transition-colors duration-500">
                        Time
                      </p>
                    </div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white transition-colors duration-500">
                      {new Date(feedback.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <div className="bg-zinc-50 dark:bg-[#0e1015] rounded-md p-4 border border-zinc-200 dark:border-zinc-800 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <svg
                      className="w-4 h-4 text-zinc-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      />
                    </svg>
                    <p className="text-xs font-bold text-zinc-500 dark:text-zinc-500 transition-colors duration-500">
                      Browser/User Agent
                    </p>
                  </div>
                  <p className="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 break-all leading-relaxed transition-colors duration-500">
                    {feedback.browser || "—"}
                  </p>
                </div>

                <div className="pt-2">
                  <p className="text-xs text-center font-bold text-zinc-400 transition-colors duration-500">
                    Logged on{" "}
                    {new Date(feedback.createdAt).toLocaleDateString(
                      undefined,
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

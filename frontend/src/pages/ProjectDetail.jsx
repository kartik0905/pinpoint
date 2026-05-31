import { SOCKET_URL, WIDGET_URL } from "../config";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";



export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : true;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  useEffect(() => {
    fetchData();

    const socket = io(SOCKET_URL);

    socket.on("connect", () => {
      socket.emit("join_project", id);
    });

    socket.on("new_feedback", (newFeedback) => {
      setFeedback((prev) => [newFeedback, ...prev]);
      toast.success("New feedback received!");
    });

    return () => socket.disconnect();
  }, [id]);

  const fetchData = async () => {
    try {
      const [projectRes, feedbackRes] = await Promise.all([
        API.get("/projects"),
        API.get(`/feedback/${id}`),
      ]);
      const found = projectRes.data.find((p) => p._id === id);
      setProject(found);
      setFeedback(feedbackRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load project details");
    } finally {
      setLoading(false);
    }
  };

  const copyScriptTag = () => {
    const tag = `<script src="${WIDGET_URL}" data-token="${project.token}"></script>`;
    navigator.clipboard.writeText(tag);
    toast.success("Script tag copied!");
  };

  const updateStatus = async (feedbackId, status) => {
    try {
      await API.patch(`/feedback/${feedbackId}`, { status });
      toast.success(`Marked as ${status}`);
      setFeedback(
        feedback.map((f) => (f._id === feedbackId ? { ...f, status } : f)),
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  const deleteFeedback = async (feedbackId) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-semibold text-zinc-900">
              Delete this feedback?
            </p>
            <p className="text-xs text-zinc-500 mt-1">This cannot be undone.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await API.delete(`/feedback/${feedbackId}`);
                  setFeedback(feedback.filter((f) => f._id !== feedbackId));
                  toast.success("Feedback deleted");
                } catch {
                  toast.error("Failed to delete feedback");
                }
              }}
              className="bg-red-500 text-white text-xs font-medium px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
            >
              Confirm Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-zinc-100 text-zinc-700 text-xs font-medium px-4 py-2 rounded-md hover:bg-zinc-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 10000 },
    );
  };

  const filtered =
    filter === "all" ? feedback : feedback.filter((f) => f.status === filter);

  if (loading)
    return (
      <div className="min-h-screen bg-indigo-50/50 dark:bg-zinc-900 flex items-center justify-center transition-colors duration-500">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Loading project data...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-indigo-50/50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 font-sans transition-colors duration-500 relative overflow-hidden">
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-b from-cyan-400/10 to-purple-400/10 dark:from-cyan-500/10 dark:to-purple-600/10 blur-[100px] rounded-full pointer-events-none -z-10 transition-colors duration-500"></div>

      <nav className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-white dark:border-zinc-800 sticky top-0 z-50 transition-colors duration-500">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors group px-3 py-1.5 rounded-lg hover:bg-white dark:hover:bg-zinc-800 shadow-sm dark:shadow-none"
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
              <span className="text-sm font-medium hidden sm:block">
                Dashboard
              </span>
            </button>
            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-700 transition-colors duration-500"></div>
            <h1 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight truncate max-w-[150px] sm:max-w-xs flex items-center gap-2 transition-colors duration-500">
              <svg
                className="w-5 h-5 text-cyan-500 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
              {project?.name}
            </h1>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800 transition-all focus:outline-none"
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

      <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">
        {/* Script tag section */}
        <div className="bg-white dark:bg-zinc-800/40 border border-white dark:border-zinc-700/50 rounded-3xl p-6 md:p-8 mb-12 shadow-xl shadow-indigo-100/50 dark:shadow-none transition-colors duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1 transition-colors duration-500">
                Installation
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 transition-colors duration-500">
                Add this script tag right before the closing{" "}
                <code className="text-xs bg-indigo-50/80 dark:bg-zinc-800 px-1.5 py-0.5 rounded transition-colors duration-500">
                  &lt;/body&gt;
                </code>{" "}
                tag on your website.
              </p>
            </div>
            <button
              onClick={copyScriptTag}
              className="shrink-0 flex items-center justify-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-md dark:shadow-[0_0_15px_rgba(255,255,255,0.1)] w-full sm:w-auto"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy Code
            </button>
          </div>

          <div className="bg-zinc-950 rounded-xl px-5 py-4 overflow-x-auto border border-zinc-800 shadow-inner">
            <code className="text-sm font-mono whitespace-nowrap">
              <span className="text-pink-500">&lt;script</span>{" "}
              <span className="text-emerald-400">src</span>=
              <span className="text-yellow-300">"{WIDGET_URL}"</span>{" "}
              <span className="text-emerald-400">data-token</span>=
              <span className="text-yellow-300">"{project?.token}"</span>
              <span className="text-pink-500">&gt;&lt;/script&gt;</span>
            </code>
          </div>
        </div>

        {/* Feedback header + filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-3 transition-colors duration-500">
            Kanban Board
            <span className="bg-indigo-100/80 text-indigo-700 dark:bg-cyan-500/10 dark:text-cyan-400 text-xs px-2.5 py-1 rounded-full font-bold border border-indigo-200/50 dark:border-cyan-500/20 transition-colors duration-500">
              {feedback.length} items
            </span>
          </h2>

          <div className="flex bg-white dark:bg-zinc-800/40 border border-white dark:border-zinc-700/50 p-1 rounded-xl shadow-md shadow-indigo-100/40 dark:shadow-none transition-colors duration-500">
            {["all", "open", "resolved"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-sm px-5 py-1.5 rounded-lg capitalize font-bold transition-all ${
                  filter === f
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-black shadow-sm"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-700/50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback list */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-zinc-800/20 border border-dashed border-indigo-200 dark:border-zinc-700 rounded-3xl transition-colors duration-500 shadow-sm dark:shadow-none">
            <div className="w-16 h-16 bg-indigo-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-500">
              <svg
                className="w-8 h-8 text-indigo-300 dark:text-zinc-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <p className="text-xl font-bold text-zinc-900 dark:text-white mb-2 transition-colors duration-500">
              Queue is empty
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 transition-colors duration-500">
              {filter === "all"
                ? "Add the script tag to your website to start collecting feedback."
                : `You don't have any ${filter} feedback items.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((item) => (
              <div
                key={item._id}
                className={`bg-white dark:bg-zinc-800/40 border p-5 rounded-2xl transition-all duration-300 group shadow-lg shadow-indigo-100/30 dark:shadow-none hover:shadow-xl ${
                  item.status === "resolved"
                    ? "border-emerald-100 dark:border-emerald-900/30 opacity-75 hover:opacity-100"
                    : "border-white dark:border-zinc-700/50 hover:border-indigo-200 dark:hover:border-zinc-600"
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div
                    className="flex-1 cursor-pointer w-full"
                    onClick={() => navigate(`/feedback/${item._id}`)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                          item.status === "open"
                            ? "bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20 text-yellow-700 dark:text-yellow-400"
                            : "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                        }`}
                      >
                        {item.status}
                      </span>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium transition-colors duration-500">
                        {new Date(item.createdAt).toLocaleDateString()} at{" "}
                        {new Date(item.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <p
                      className={`text-base font-medium mb-3 transition-colors duration-500 ${item.status === "resolved" ? "text-zinc-500 dark:text-zinc-400 line-through" : "text-zinc-900 dark:text-white"}`}
                    >
                      {item.comment || "No comment provided by user"}
                    </p>

                    <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 dark:text-zinc-500 transition-colors duration-500">
                      <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                        <svg
                          className="w-3.5 h-3.5 flex-shrink-0"
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
                        <span className="truncate">
                          {item.url || "Unknown URL"}
                        </span>
                      </div>
                      <div className="hidden sm:flex items-center gap-1.5 truncate max-w-[200px]">
                        <svg
                          className="w-3.5 h-3.5 flex-shrink-0"
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
                        <span className="truncate">
                          {item.browser?.slice(0, 40) || "Unknown Browser"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800 pt-3 sm:pt-0 mt-3 sm:mt-0 transition-colors duration-500">
                    <button
                      onClick={() =>
                        updateStatus(
                          item._id,
                          item.status === "open" ? "resolved" : "open",
                        )
                      }
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors w-full sm:w-auto text-center ${
                        item.status === "open"
                          ? "bg-indigo-50 dark:bg-zinc-800 text-indigo-700 dark:text-zinc-300 hover:bg-indigo-100 dark:hover:bg-zinc-700"
                          : "bg-transparent border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {item.status === "open" ? "Mark Resolve" : "Reopen"}
                    </button>
                    <button
                      onClick={() => deleteFeedback(item._id)}
                      className="text-xs font-bold text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {item.screenshot && (
                  <div
                    className="mt-4 cursor-pointer relative rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800 group-hover:border-indigo-200 dark:group-hover:border-zinc-600 transition-colors"
                    onClick={() => navigate(`/feedback/${item._id}`)}
                  >
                    <div className="absolute inset-0 bg-zinc-900/0 group-hover:bg-zinc-900/10 dark:group-hover:bg-zinc-900/30 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 bg-white/90 dark:bg-black/80 backdrop-blur-sm text-zinc-900 dark:text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all">
                        View Full Image
                      </span>
                    </div>
                    <img
                      src={item.screenshot}
                      alt="Screenshot"
                      className="w-full h-32 sm:h-48 object-cover object-top"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

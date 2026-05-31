import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    setCreating(true);
    try {
      const res = await API.post("/projects", { name: newProjectName.trim() });
      setProjects([res.data, ...projects]);
      setNewProjectName("");
      toast.success("Project created");
    } catch (err) {
      toast.error("Failed to create project");
    } finally {
      setCreating(false);
    }
  };

  const deleteProject = async (id) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-semibold text-zinc-900">
              Delete this project?
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              All feedback will be permanently lost.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await API.delete(`/projects/${id}`);
                  setProjects(projects.filter((p) => p._id !== id));
                  toast.success("Project deleted");
                } catch {
                  toast.error("Failed to delete project");
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

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-indigo-50/50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 font-sans transition-colors duration-500 relative overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-[-10%] left-[20%] w-[600px] h-[500px] bg-gradient-to-b from-cyan-400/20 to-purple-400/20 dark:from-cyan-500/10 dark:to-purple-600/10 blur-[120px] rounded-full pointer-events-none -z-10 transition-colors duration-500"></div>

      {/* Navbar */}
      <nav className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-white dark:border-zinc-800 sticky top-0 z-50 transition-colors duration-500">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div
            className="flex items-center gap-2 group cursor-pointer"
            onClick={() => navigate("/")}
          >
            <svg
              className="w-6 h-6 text-cyan-600 dark:text-cyan-400 transition-transform group-hover:rotate-90 duration-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v4M12 18v4M4 12H2M22 12h-2" />
              <circle cx="12" cy="12" r="10" className="opacity-30" />
            </svg>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tighter transition-colors duration-500">
              Pinpoint
            </h1>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <span className="text-sm font-medium text-zinc-500 hidden sm:block">
              {user?.email}
            </span>
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
            <button
              onClick={handleLogout}
              className="text-sm font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-4 py-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2 tracking-tight transition-colors duration-500">
            Your Projects
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 transition-colors duration-500">
            Each project has a unique script tag to embed on your website.
          </p>
        </div>

        {/* Create project form */}
        <form
          onSubmit={createProject}
          className="flex flex-col sm:flex-row gap-3 mb-12"
        >
          <input
            type="text"
            placeholder="Project name (e.g. Acme Dashboard)"
            className="flex-1 bg-white dark:bg-zinc-800/40 border border-white dark:border-zinc-700/50 rounded-xl px-5 py-3 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 dark:focus:border-cyan-500 shadow-md shadow-indigo-100/50 dark:shadow-none transition-all duration-300"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
          <button
            type="submit"
            disabled={creating}
            className="bg-zinc-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl text-sm font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 transition-colors shadow-md dark:shadow-[0_0_15px_rgba(255,255,255,0.1)] whitespace-nowrap"
          >
            {creating ? "Creating..." : "Create Project"}
          </button>
        </form>

        {/* Projects list */}
        {loading ? (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-medium text-zinc-500">
              Loading projects...
            </p>
          </div>
        ) : projects.length === 0 ? (
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
              No projects yet
            </p>
            <p className="text-sm text-zinc-500">
              Create your first project above to get your script tag.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-white dark:bg-zinc-800/40 border border-white dark:border-zinc-700/50 p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-indigo-100/40 dark:shadow-none hover:shadow-xl hover:border-indigo-100 dark:hover:border-zinc-600/80 transition-all duration-300 group"
              >
                <div
                  className="cursor-pointer flex-1"
                  onClick={() => navigate(`/projects/${project._id}`)}
                >
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400 font-medium transition-colors duration-500">
                    <span className="flex items-center gap-1.5 bg-indigo-50/50 dark:bg-zinc-800 px-2.5 py-1 rounded-md border border-indigo-100/50 dark:border-transparent transition-colors duration-500">
                      <svg
                        className="w-4 h-4 text-cyan-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        />
                      </svg>
                      {project.feedbackCount || 0} issues
                    </span>
                    <span>·</span>
                    <span>
                      Created {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                  <button
                    onClick={() => navigate(`/projects/${project._id}`)}
                    className="flex-1 sm:flex-none text-center bg-indigo-50 dark:bg-cyan-500/10 text-indigo-600 dark:text-cyan-400 hover:bg-indigo-100 dark:hover:bg-cyan-500/20 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                  >
                    Open Dashboard
                  </button>
                  <button
                    onClick={() => deleteProject(project._id)}
                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors focus:outline-none"
                    aria-label="Delete project"
                  >
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

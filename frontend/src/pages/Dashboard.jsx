import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      setError("Failed to load projects");
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
    } catch (err) {
      setError("Failed to create project");
    } finally {
      setCreating(false);
    }
  };

  const deleteProject = async (id) => {
    if (!confirm("Delete this project and all its feedback?")) return;
    try {
      await API.delete(`/projects/${id}`);
      setProjects(projects.filter((p) => p._id !== id));
    } catch (err) {
      setError("Failed to delete project");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-900">FeedbackWidget</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Your Projects
          </h2>
          <p className="text-gray-500 text-sm">
            Each project has a unique script tag to embed on your website.
          </p>
        </div>

        {/* Create project form */}
        <form onSubmit={createProject} className="flex gap-3 mb-8">
          <input
            type="text"
            placeholder="Project name e.g. My Portfolio"
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
          <button
            type="submit"
            disabled={creating}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {creating ? "Creating..." : "New Project"}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Projects list */}
        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg mb-1">No projects yet</p>
            <p className="text-sm">Create your first project above</p>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between hover:border-indigo-200 transition-colors"
              >
                <div
                  className="cursor-pointer flex-1"
                  onClick={() => navigate(`/projects/${project._id}`)}
                >
                  <h3 className="font-medium text-gray-900">{project.name}</h3>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {project.feedbackCount} feedback · Created{" "}
                    {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate(`/projects/${project._id}`)}
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    View
                  </button>
                  <button
                    onClick={() => deleteProject(project._id)}
                    className="text-sm text-red-400 hover:text-red-600"
                  >
                    Delete
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

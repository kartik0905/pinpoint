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

  useEffect(() => {
    fetchData();
    
     const socket = io("http://localhost:3000");

     socket.on("connect", () => {
       socket.emit("join_project", id);
     });

     socket.on("new_feedback", (newFeedback) => {
       setFeedback((prev) => [newFeedback, ...prev]);
       toast.success("New feedback received!");
     });

     // Cleanup on unmount
     return () => {
       socket.disconnect();
     };
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
    } finally {
      setLoading(false);
    }
  };

  const copyScriptTag = () => {
    const tag = `<script src="http://localhost:5500/widget.js" data-token="${project.token}"></script>`;
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
    }
  };

  const deleteFeedback = async (feedbackId) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Delete this feedback?</p>
          <p className="text-xs text-gray-500">This cannot be undone.</p>
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
              className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-lg"
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
      <div className="flex items-center justify-center h-screen text-gray-400">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate("/")}
          className="text-gray-400 hover:text-gray-600 text-sm"
        >
          ← Back
        </button>
        <h1 className="text-lg font-semibold text-gray-900">{project?.name}</h1>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Script tag section */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-8">
          <h3 className="font-medium text-gray-900 mb-1">
            Embed on your website
          </h3>
          <p className="text-sm text-gray-500 mb-3">
            Add this script tag before the closing body tag of your website.
          </p>
          <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center justify-between gap-3">
            <code className="text-xs text-gray-600 break-all">
              {`<script src="http://localhost:5500/widget.js" data-token="${project?.token}"></script>`}
            </code>
            <button
              onClick={copyScriptTag}
              className="shrink-0 text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Feedback header + filters */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">
            Feedback
            <span className="ml-2 text-sm text-gray-400 font-normal">
              {feedback.length} total
            </span>
          </h2>
          <div className="flex gap-2">
            {["all", "open", "resolved"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs px-3 py-1.5 rounded-lg capitalize font-medium ${
                  filter === f
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-500 border border-gray-200 hover:border-indigo-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback list */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg mb-1">No feedback yet</p>
            <p className="text-sm">
              Add the script tag to your website to start collecting
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:border-indigo-200 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => navigate(`/feedback/${item._id}`)}
                  >
                    <p className="text-sm text-gray-900 font-medium mb-1">
                      {item.comment}
                    </p>
                    <p className="text-xs text-gray-400">
                      {item.url} · {item.browser?.slice(0, 40)} ·{" "}
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        item.status === "open"
                          ? "bg-yellow-50 text-yellow-600"
                          : "bg-green-50 text-green-600"
                      }`}
                    >
                      {item.status}
                    </span>
                    <button
                      onClick={() =>
                        updateStatus(
                          item._id,
                          item.status === "open" ? "resolved" : "open",
                        )
                      }
                      className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 px-2 py-1 rounded-lg"
                    >
                      {item.status === "open" ? "Resolve" : "Reopen"}
                    </button>
                    <button
                      onClick={() => deleteFeedback(item._id)}
                      className="text-xs text-red-400 hover:text-red-600 border border-red-100 px-2 py-1 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Screenshot thumbnail */}
                {item.screenshot && (
                  <div
                    className="mt-3 cursor-pointer"
                    onClick={() => navigate(`/feedback/${item._id}`)}
                  >
                    <img
                      src={item.screenshot}
                      alt="Screenshot"
                      className="w-full max-h-32 object-cover object-top rounded-lg border border-gray-100"
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

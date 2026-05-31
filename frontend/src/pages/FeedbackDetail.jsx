import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

export default function FeedbackDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();
  }, [id]);

  const fetchFeedback = async () => {
    try {
      const res = await API.get(`/feedback/single/${id}`);
      setFeedback(res.data);
    } catch (err) {
      console.error(err);
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
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        Loading...
      </div>
    );

  if (!feedback)
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        Feedback not found
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-gray-600 text-sm"
        >
          ← Back
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Feedback Detail</h1>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="grid grid-cols-3 gap-6">
          {/* Screenshot — left side, larger */}
          <div className="col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Screenshot
              </h3>
              {feedback.screenshot ? (
                <img
                  src={feedback.screenshot}
                  alt="Feedback screenshot"
                  className="w-full rounded-lg border border-gray-100"
                />
              ) : (
                <div className="bg-gray-50 rounded-lg h-48 flex items-center justify-center text-gray-400 text-sm">
                  No screenshot
                </div>
              )}
            </div>
          </div>

          {/* Details — right side */}
          <div className="space-y-4">
            {/* Comment */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                Comment
              </h3>
              <p className="text-sm text-gray-900">{feedback.comment}</p>
            </div>

            {/* Status */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                Status
              </h3>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    feedback.status === "open"
                      ? "bg-yellow-50 text-yellow-600"
                      : "bg-green-50 text-green-600"
                  }`}
                >
                  {feedback.status}
                </span>
                <button
                  onClick={() =>
                    updateStatus(
                      feedback.status === "open" ? "resolved" : "open",
                    )
                  }
                  className="text-xs text-gray-400 hover:text-gray-700 underline"
                >
                  {feedback.status === "open" ? "Mark resolved" : "Reopen"}
                </button>
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                Details
              </h3>
              <div>
                <p className="text-xs text-gray-400">Page URL</p>
                <p className="text-xs text-gray-700 break-all mt-0.5">
                  {feedback.url || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Device</p>
                <p className="text-xs text-gray-700 mt-0.5">
                  {feedback.device || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Browser</p>
                <p className="text-xs text-gray-700 mt-0.5 break-all">
                  {feedback.browser?.slice(0, 60) || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Submitted</p>
                <p className="text-xs text-gray-700 mt-0.5">
                  {new Date(feedback.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

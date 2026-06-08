const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const {
  submitFeedback,
  getFeedbackByProject,
  getFeedbackById,
  updateFeedbackStatus,
  deleteFeedback,
} = require("../controllers/feedback.controller");

// POST /api/feedback — submit feedback (called by widget, no auth needed)
router.post("/", submitFeedback);

// GET /api/feedback/:projectId — get all feedback for a project (auth required)
router.get("/:projectId", auth, getFeedbackByProject);

// GET /api/feedback/single/:id — get single feedback detail (auth required)
router.get("/single/:id", auth, getFeedbackById);

// PATCH /api/feedback/:id — update status (auth required)
router.patch("/:id", auth, updateFeedbackStatus);

// DELETE /api/feedback/:id
router.delete("/:id", auth, deleteFeedback);

module.exports = router;

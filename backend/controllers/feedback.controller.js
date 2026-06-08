const Feedback = require("../models/Feedback.model");
const Project = require("../models/Project.model");

// POST /api/feedback — submit feedback (called by widget, no auth needed)
exports.submitFeedback = async (req, res) => {
  try {
    const { token, screenshot, comment, url, browser, device } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Project token is required" });
    }

    if (!comment || !comment.trim()) {
      return res.status(400).json({ message: "Comment is required" });
    }

    // Find project by token
    const project = await Project.findOne({ token });
    if (!project) {
      return res.status(404).json({ message: "Invalid project token" });
    }

    const feedback = await Feedback.create({
      projectId: project._id,
      screenshot,
      comment: comment.trim(),
      url,
      browser,
      device,
    });

    // Increment feedback count on project
    await Project.findByIdAndUpdate(project._id, {
      $inc: { feedbackCount: 1 },
    });

    const io = req.app.get("io");
    io.to(project._id.toString()).emit("new_feedback", {
      _id: feedback._id,
      comment: feedback.comment,
      url: feedback.url,
      browser: feedback.browser,
      device: feedback.device,
      status: feedback.status,
      screenshot: feedback.screenshot,
      createdAt: feedback.createdAt,
    });

    res.status(201).json({ message: "Feedback submitted", id: feedback._id });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/feedback/:projectId — get all feedback for a project (auth required)
exports.getFeedbackByProject = async (req, res) => {
  try {
    // Verify project belongs to logged in user
    const project = await Project.findOne({
      _id: req.params.projectId,
      userId: req.user.id,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const feedback = await Feedback.find({
      projectId: req.params.projectId,
    }).sort({ createdAt: -1 });

    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/feedback/single/:id — get single feedback detail (auth required)
exports.getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id).populate(
      "projectId",
    );

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    // Verify ownership
    const project = await Project.findOne({
      _id: feedback.projectId,
      userId: req.user.id,
    });

    if (!project) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PATCH /api/feedback/:id — update status (auth required)
exports.updateFeedbackStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["open", "resolved"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Status must be open or resolved" });
    }

    const feedback = await Feedback.findById(req.params.id).populate(
      "projectId",
    );

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    // Verify ownership
    const project = await Project.findOne({
      _id: feedback.projectId,
      userId: req.user.id,
    });

    if (!project) {
      return res.status(403).json({ message: "Not authorized" });
    }

    feedback.status = status;
    await feedback.save();

    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE /api/feedback/:id
exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id).populate(
      "projectId",
    );

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    const project = await Project.findOne({
      _id: feedback.projectId,
      userId: req.user.id,
    });

    if (!project) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await feedback.deleteOne();

    // Decrement feedback count
    await Project.findByIdAndUpdate(project._id, {
      $inc: { feedbackCount: -1 },
    });

    res.json({ message: "Feedback deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

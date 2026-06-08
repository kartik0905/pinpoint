const Project = require("../models/Project.model");

// GET /api/projects — get all projects for logged in user
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/projects — create new project
exports.createProject = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const project = await Project.create({
      userId: req.user.id,
      name: name.trim(),
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE /api/projects/:id — delete a project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await project.deleteOne();
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

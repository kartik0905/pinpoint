const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const {
  getAllProjects,
  createProject,
  deleteProject,
} = require("../controllers/projects.controller");

// GET /api/projects — get all projects for logged in user
router.get("/", auth, getAllProjects);

// POST /api/projects — create new project
router.post("/", auth, createProject);

// DELETE /api/projects/:id — delete a project
router.delete("/:id", auth, deleteProject);

module.exports = router;

const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const passport = require("./config/passport");



const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Make io accessible in routes
app.set("io", io);

// Middleware
app.use(cors());
app.use(passport.initialize());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/projects", require("./routes/projects.routes"));
app.use("/api/feedback", require("./routes/feedback.routes"));

// Health check
app.get("/", (req, res) => {
  res.json({ status: "FeedbackWidget API running" });
});

// Socket connection
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Developer joins their project room to receive live feedback
  socket.on("join_project", (projectId) => {
    socket.join(projectId);
    console.log(`Socket ${socket.id} joined project ${projectId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    server.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });

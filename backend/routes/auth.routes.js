const router = require("express").Router();
const passport = require("../config/passport");
const {
  sendOtp,
  register,
  login,
  googleCallback,
} = require("../controllers/auth.controller");

router.post("/send-otp", sendOtp);

router.post("/register", register);

router.post("/login", login);

// GET /api/auth/google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

// GET /api/auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login`,
    session: false,
  }),
  googleCallback,
);

module.exports = router;

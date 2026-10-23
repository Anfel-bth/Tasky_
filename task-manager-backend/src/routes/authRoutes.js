const express = require("express");
const router = express.Router();

const {
  login,
  logout,
  register,
  verifyOtp,
  resendOtp,
} = require("../controllers/authController");

router.post("/login", login);
router.post("/logout", logout);
router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);


module.exports = router;

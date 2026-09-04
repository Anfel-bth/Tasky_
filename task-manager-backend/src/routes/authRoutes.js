const express = require("express");
const router = express.Router();

const { login } = require("../controllers/authController");
const {
  register,
  verifyOtp,
  resendOtp,
} = require("../controllers/authController");

router.post("/login", login);
router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);


module.exports = router;

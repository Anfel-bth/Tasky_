const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = async (to, otp) => {
  await transporter.sendMail({
    from: `"Tasky" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify your Tasky account",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Verify your email</h2>
        <p>Your verification code is:</p>
        <h1 style="letter-spacing: 6px;">${otp}</h1>
        <p>This code expires in 10 minutes.</p>
      </div>
    `,
  });
};

module.exports = sendOtpEmail;

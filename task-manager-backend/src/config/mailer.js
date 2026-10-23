const nodemailer = require("nodemailer");
require("dotenv").config();

function getEmailFrom() {
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;
  if (!from) {
    throw new Error(
      "Set EMAIL_FROM or EMAIL_USER to configure the OTP sender address.",
    );
  }
  return from.includes("<") ? from : `"Tasky" <${from}>`;
}

const sendOtpEmail = async (to, otp) => {
  const provider = process.env.EMAIL_PROVIDER || "smtp";
  const email = {
    from: getEmailFrom(),
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
  };

  if (provider === "resend") {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is required when EMAIL_PROVIDER=resend.");
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...email, to: [to] }),
    });

    if (!response.ok) {
      const details = await response.text();
      throw new Error(`Resend email request failed (${response.status}): ${details}`);
    }
    return;
  }

  if (provider !== "smtp") {
    throw new Error("EMAIL_PROVIDER must be either 'resend' or 'smtp'.");
  }
  const host = process.env.EMAIL_HOST || (process.env.EMAIL_USER ? "smtp.gmail.com" : "");
  if (!host) {
    throw new Error(
      "EMAIL_HOST is required for SMTP (or set EMAIL_USER to use Gmail SMTP).",
    );
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === "true",
    ...(process.env.EMAIL_USER && process.env.EMAIL_PASS
      ? {
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        }
      : {}),
  });

  try {
    await transporter.sendMail(email);
  } finally {
    transporter.close();
  }
};

module.exports = sendOtpEmail;

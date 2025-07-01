const nodemailer = require("nodemailer");

const sendMail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"FileUpload App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      text: text,
    });

    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ Email sending error:", error);
    throw error;
  }
};

module.exports = sendMail;

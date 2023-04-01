const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, message }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: "CSS Nits <css official>",
    to: to,
    subject: subject,
    text: message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

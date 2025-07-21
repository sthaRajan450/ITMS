const nodemailer = require("nodemailer");

const sendApplicationDecisionEmail = async ({ to, name, status }) => {
  if (!to || !status) throw new Error("Missing required fields");

  let subject, html;

  if (status === "accepted") {
    subject = "🎉 Congratulations! Your application was accepted.";
    html = `<p>Dear ${name || "Applicant"},</p>
            <p>We are pleased to inform you that your job application has been <b>accepted</b>.</p>
            <p>Our team will be contacting you shortly for the next steps.</p>
            <p>Best regards,<br>ITMS Nepal Team</p>`;
  } else if (status === "rejected") {
    subject = "📢 Update on Your Job Application";
    html = `<p>Dear ${name || "Applicant"},</p>
            <p>Thank you for your interest. We regret to inform you that your job application has been <b>rejected</b> at this time.</p>
            <p>We encourage you to apply again in the future.</p>
            <p>Best wishes,<br>ITMS Nepal Team</p>`;
  } else {
    throw new Error("Invalid status value");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: '"ITMS Nepal" <itmsnepal@gmail.com>',
    to,
    subject,
    html,
  });

  console.log("Email sent:", info.messageId);
  return info.messageId;
};

module.exports = { sendApplicationDecisionEmail };

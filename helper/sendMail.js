const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: false,
  auth: {
    user: "maharzanshuseel10@gmail.com",
    pass: "epczbbgbaytcopsi",
  },
});

async function sendMail(to, subject, text, html) {
  const info = await transporter.sendMail({
    from: "maharzanshuseel10@gmail.com",
    to,
    subject,
    text,
    html,
  });

  // console.log("Message sent: %s", info.messageId);
}

module.exports = { sendMail };

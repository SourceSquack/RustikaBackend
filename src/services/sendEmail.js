const nodemailer = require("nodemailer");
const mailSender = (email, subject, text) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_PROVIDER,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      text: text,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log(info);
        resolve("Email sent: " + info.response);
      }
    });
  });
};

module.exports = {mailSender}

const nodemailer = require('nodemailer');
const User = require('../models/User');
const logger = require('./logger');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendEmail(userId, subject, text, eventType) {
  try {
    const user = await User.findByPk(userId);
    if (!user) return;

    if ((eventType === 'taskAssignment' && user.notifyOnTaskAssignment) ||
        (eventType === 'statusChange' && user.notifyOnStatusChange)) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject,
        text
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          logger.error(`Error sending email: ${error.message}`);
        } else {
          logger.info(`Email sent: ${info.response}`);
        }
      });
    }
  } catch (error) {
    logger.error(`Error in sendEmail: ${error.message}`);
  }
}

module.exports = { sendEmail };

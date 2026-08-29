const { getTransporter } = require('../config/mail.config');
require('dotenv').config();

/**
 * Reusable low-level asynchronous email sending wrapper.
 * Guarantees that errors never bubble up to crash the checkout or cancellation process.
 * Logs events to stdout in a clean, production-ready format.
 */
const sendEmail = async ({ to, subject, html }) => {
    console.log("🚀 sendEmail() CALLED");

    const timestamp = new Date().toISOString();

    if (!to) {
    console.error(`\n-------------------------\nEmail Failed\nRecipient: [Missing]\nSubject: ${subject}\nError: No recipient email address specified.\nTime: ${timestamp}\n-------------------------\n`);
    return { success: false, error: 'Recipient is missing' };
  }

  try {
    const transporter = await getTransporter();
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Cineverse Support" <noreply@cineverse.com>',
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log(`\n-------------------------\nEmail Sent Successfully\nRecipient: ${to}\nSubject: ${subject}\nMessageID: ${info.messageId || 'N/A'}\nTime: ${timestamp}\n-------------------------\n`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`\n-------------------------\nEmail Failed\nRecipient: ${to}\nSubject: ${subject}\nError: ${error.message}\nTime: ${timestamp}\n-------------------------\n`);
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;

const nodemailer = require('nodemailer');
require('dotenv').config();

const emailConfig = {
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT, 10) || 587,
  secure: process.env.EMAIL_PORT == 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
};

let transporterPromise;

/**
 * Creates and verifies the transporter. If Gmail credentials fail,
 * falls back to Ethereal test email service automatically.
 * Returns a Promise that resolves to a working transporter.
 */
const initTransporter = () => {
  if (transporterPromise) return transporterPromise;

  const hasCredentials =
    process.env.EMAIL_HOST &&
    process.env.EMAIL_USER &&
    process.env.EMAIL_PASS;

  if (!hasCredentials) {
    console.warn('\x1b[33m%s\x1b[0m', '⚠️ SMTP credentials missing. Using mock transporter.');
    transporterPromise = Promise.resolve({
      sendMail: async (options) => {
        console.log('\n================= MOCK EMAIL =================');
        console.log(`To: ${options.to}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Body (Length): ${options.html ? options.html.length : 0} chars`);
        console.log('===============================================\n');
        return { messageId: 'mock_id' };
      }
    });
    return transporterPromise;
  }

  transporterPromise = new Promise(async (resolve) => {
    const mainTransporter = nodemailer.createTransport(emailConfig);

    try {
      await mainTransporter.verify();
      console.log('✅ Gmail SMTP transporter verified and ready.');
      resolve(mainTransporter);
    } catch (err) {
      console.error('❌ Gmail SMTP verification failed:', err.message);
      console.log('🔄 Falling back to Ethereal test email service...');

      try {
        const testAccount = await nodemailer.createTestAccount();
        const etherealTransporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass
          }
        });
        console.log('✅ Ethereal transporter ready.');
        console.log(`📧 View sent emails at: https://ethereal.email/login`);
        console.log(`   Username: ${testAccount.user}`);
        console.log(`   Password: ${testAccount.pass}`);
        resolve(etherealTransporter);
      } catch (fallbackErr) {
        console.error('❌ Ethereal fallback failed:', fallbackErr.message);
        // Resolve with a mock that logs
        resolve({
          sendMail: async (options) => {
            console.log(`[MOCK] Would have sent email to ${options.to}: ${options.subject}`);
            return { messageId: 'fallback_mock_id' };
          }
        });
      }
    }
  });

  return transporterPromise;
};

/**
 * Returns the transporter (may be Gmail, Ethereal, or mock).
 * This is async — callers should await getTransporter().
 */
const getTransporter = async () => {
  return initTransporter();
};

module.exports = { getTransporter };

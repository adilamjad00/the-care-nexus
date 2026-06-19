const nodemailer = require('nodemailer');
const emailTemplates = require('./emailTemplates');

// Gmail App Passwords are shown with spaces for readability but must be sent
// without any whitespace to authenticate correctly.
const smtpPass = (process.env.SMTP_PASS || '').replace(/\s+/g, '');
const smtpUser = process.env.SMTP_USER || '';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: false,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify SMTP connection at startup — logs success or the exact error
transporter.verify((error) => {
  if (error) {
    console.error(
      `[SMTP] ❌ Connection failed — user="${smtpUser}" pass-length=${smtpPass.length}:`,
      error.message,
    );
  } else {
    console.log(
      `[SMTP] ✅ Connected — user="${smtpUser}" pass-length=${smtpPass.length}`,
    );
  }
});

exports.sendEmail = async (...args) => {
  let to, subject, html, templateName, data;

  if (args.length === 1 && args[0] && typeof args[0] === 'object') {
    ({ to, subject, html, templateName, data } = args[0]);
  } else {
    [to, subject, templateName, data] = args;
  }

  const label = templateName || 'custom';

  try {
    let body = html;
    if (!body && templateName) {
      const render = emailTemplates[templateName];
      if (typeof render !== 'function') {
        throw new Error(`Unknown email template: "${templateName}"`);
      }
      body = render(data);
    }

    if (!body) {
      throw new Error(
        'sendEmail requires either `html` or a valid `templateName`',
      );
    }

    const mailOptions = {
      from: `"The Care Nexus" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: body,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${label} to ${to} (MessageID: ${info.messageId})`);
    return true;
  } catch (error) {
    console.error(
      `Email error: Failed to send ${label} to ${to}:`,
      error.message,
    );
    return false;
  }
};

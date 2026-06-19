const { wrapEmail } = require('./emailLayout');

const getVerificationEmail = (name, token) => {
  const url = `${process.env.FRONTEND_URL}/verify/${token}`;
  return wrapEmail(`
    <div class="badge">Account Verification</div>
    <h1 class="title">Confirm your email</h1>
    <p class="text">Welcome to The Care Nexus. To activate your account and finish setting up your workspace, please verify your email below.</p>
    <div class="button-container">
        <a href="${url}" class="button">Verify email</a>
    </div>
    <div class="note">
        This link will remain active for a limited time. If it expires, just request a new one from the sign-up page.
    </div>
    <p class="text-muted">If you didn't create a The Care Nexus account, you can safely ignore this message.</p>
  `);
};

const getForgotPasswordEmail = (token) => {
  const url = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  return wrapEmail(`
    <div class="badge">Password Reset</div>
    <h1 class="title">Reset your password</h1>
    <p class="text">We received a request to reset the password on your The Care Nexus account. Click the button below to choose a new one.</p>
    <div class="button-container">
        <a href="${url}" class="button">Reset password</a>
    </div>
    <div class="note">
        This reset link is valid for <strong>60 minutes</strong>. If you did not request this change, your account is still secure and no action is needed.
    </div>
  `);
};

module.exports = {
  getVerificationEmail,
  getForgotPasswordEmail,
};

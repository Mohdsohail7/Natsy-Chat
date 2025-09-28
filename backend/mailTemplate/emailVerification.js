// backend/utils/emailTemplates.js

const verificationEmail = (username, verificationLink) => {
  return `
  <div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:8px;overflow:hidden;font-family:Arial, sans-serif;color:#1f2937;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <!-- Header -->
    <div style="background-color:#10b981;color:#ffffff;padding:20px;text-align:center;">
      <h2 style="font-size:20px;font-weight:600;margin:0;">Nastychat - Account Verification</h2>
    </div>

    <!-- Content -->
    <div style="padding:30px;text-align:center;line-height:1.6;">
      <h1 style="font-size:24px;font-weight:700;margin-bottom:16px;">Hello, ${username || "User"}!</h1>
      <p style="margin:0 0 20px 0;">
        Thank you for registering with <b>Nastychat</b>. To complete your registration 
        and enable permanent access, please click the button below:
      </p>

      <a href="${verificationLink}" 
         style="display:inline-block;background-color:#3b82f6;color:#ffffff;padding:12px 25px;margin:20px 0;
                text-decoration:none;border-radius:6px;font-weight:600;font-size:16px;">
        Verify My Email
      </a>

      <p style="font-size:14px;margin-top:20px;">If the button above does not work, copy & paste this link:</p>
      <p style="font-size:12px;word-break:break-word;margin-top:8px;">
        <a href="${verificationLink}" style="color:#2563eb;text-decoration:underline;">${verificationLink}</a>
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color:#f3f4f6;padding:15px;text-align:center;font-size:12px;color:#6b7280;">
      This is an automated email from Nastychat. Please do not reply.
    </div>
  </div>
  `;
};

module.exports = { verificationEmail };

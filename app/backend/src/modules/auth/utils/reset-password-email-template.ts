// Creates HTML email content for password reset OTP
export const createResetPasswordEmailTemplate = (otp: string) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>MeetFlow Password Reset</h2>

      <p>You requested to reset your password.</p>

      <p>Your password reset OTP is:</p>

      <h1 style="letter-spacing: 4px;">${otp}</h1>

      <p>This OTP is valid for 5 minutes.</p>

      <p>If you did not request this, please ignore this email.</p>
    </div>
  `;
};
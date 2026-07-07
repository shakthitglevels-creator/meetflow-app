

// Creates HTML email content for OTP verification
export const createOtpEmailTemplate = (otp: string) => {
    return `
        <div style="font-family: Arial, sans-serif; padding: 20px;>
            <h2>MeetFlow Email Verification</h2>
            <p>Your verification OTP is:</p>
            <h1 style="letter-spacing: 4px;">${otp}</h1>
            <p>This OTP is valid for 5 minutes</p>
            <p>If you did not request this, you can safely ignore this email.</p>
        </div>
    `
}
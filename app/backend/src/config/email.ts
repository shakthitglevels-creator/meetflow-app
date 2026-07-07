import nodemailer from "nodemailer"
import { env } from "./env"

// create reuseable transporter 
export const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT),
    secure: false,
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS
    }
})

// Send email helper
export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
) => {
  await transporter.sendMail({
    from: `"MeetFlow" <${env.SMTP_USER}>`,
    to,
    subject,
    text,
    html,
  });
};
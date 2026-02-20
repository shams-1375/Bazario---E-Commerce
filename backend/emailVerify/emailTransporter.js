import nodemailer from "nodemailer";
import "dotenv/config";

export const transporter = nodemailer.createTransport({
  host: process.env.RESEND_SMTP_HOST,
  port: Number(process.env.RESEND_SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.RESEND_SMTP_USER,
    pass: process.env.RESEND_SMTP_PASS,
  },
});
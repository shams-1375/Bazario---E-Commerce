import { transporter } from "./emailTransporter.js";

export const verifyEmail = async (accessToken, email) => {
    try {
        await transporter.sendMail({
            from: "Bazario <bazario@resend.dev>",
            to: email,
            subject: "Verify Your Email Address 🚀",
            html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
          <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 25px; border-radius: 8px;">
            <h2 style="color: #0f766e; text-align: center;">Welcome to Bazario 🎉</h2>
            <p>Thank you for registering. Please verify your email.</p>
            <div style="text-align:center; margin:20px;">
              <a href="https://bazario-e-commerce-frontend.onrender.com/verify/${accessToken}"
                 style="background:#0f766e;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;">
                Verify Email ✅
              </a>
            </div>
            <p style="font-size:13px;color:#999;text-align:center;">
              © ${new Date().getFullYear()} Bazario
            </p>
          </div>
        </div>
      `,
        });

        return { success: true };
    } catch (error) {
        console.error("Verify email failed:", error);
        throw new Error("Email sending failed");
    }
};
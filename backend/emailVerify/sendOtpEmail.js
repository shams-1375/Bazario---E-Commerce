import { transporter } from "./emailTransporter.js";

export const sendOtpEmail = async (otp, email) => {
    try {
        await transporter.sendMail({
            from: "Bazario <bazario@resend.dev>",
            to: email,
            subject: "Your Password Reset OTP 🔐",
            html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
          <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 25px; border-radius: 8px;">
            <h2 style="color:#0f766e;text-align:center;">Password Reset 🔑</h2>
            <p>Your OTP:</p>
            <div style="font-size:28px;font-weight:bold;text-align:center;color:#0f766e;">
              ${otp}
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
        console.error("OTP email failed:", error);
        throw new Error("Unable to send OTP email");
    }
};
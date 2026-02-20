import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpEmail = async (otp, email) => {
  try {
    await resend.emails.send({
      from: "Bazario <bazario@resend.dev>",
      to: email,
      subject: "Your Password Reset OTP 🔐",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
          <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 25px; border-radius: 8px;">
            
            <h2 style="color: #0f766e; text-align: center;">
              Password Reset Request 🔑
            </h2>

            <p style="color: #333;">Hi 👋,</p>

            <p style="color: #555;">
              We received a request to reset your password.
              Please use the OTP below:
            </p>

            <div style="
              text-align: center;
              font-size: 28px;
              font-weight: bold;
              letter-spacing: 6px;
              color: #0f766e;
              margin: 20px 0;
            ">
              ${otp}
            </div>

            <p style="color: #555;">
              This OTP is valid for a limited time.
              Please do not share it with anyone.
            </p>

            <hr style="border: none; border-top: 1px solid #eee;" />

            <p style="color: #999; font-size: 13px; text-align: center;">
              © ${new Date().getFullYear()} Bazario. All rights reserved.
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
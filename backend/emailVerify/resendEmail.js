import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerifyEmail = async (token, email) => {
    await resend.emails.send({
        from: "Bazario <bazario@resend.dev>",
        to: email,
        subject: "Verify Your Email Address 🚀",
        html: `
      <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
        <div style="max-width:500px;margin:auto;background:#fff;padding:25px;border-radius:8px;">
          <h2 style="color:#0f766e;text-align:center;">Welcome to Bazario 🎉</h2>
          <p>Please verify your email to activate your account.</p>

          <div style="text-align:center;margin:20px 0;">
            <a href="https://bazario-e-commerce-frontend.onrender.com/verify/${token}"
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
};
import nodemailer from "nodemailer";
import "dotenv/config";

export const verifyEmail = async (accessToken, email) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        const mailConfigurations = {
            from: `"Your App Team" <${process.env.MAIL_USER}>`,
            to: email,
            subject: "Verify Your Email Address 🚀",
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
                    <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 25px; border-radius: 8px;">
                        
                        <h2 style="color: #0f766e; text-align: center;">
                            Welcome! 🎉
                        </h2>

                        <p style="color: #333;">
                            Hi there 👋,
                        </p>

                        <p style="color: #555;">
                            Thank you for registering with us.  
                            To complete your account setup, please verify your email address.
                        </p>

                        <div style="text-align: center; margin: 25px 0;">
                            <a 
                                href="https://bazario-e-commerce-frontend.onrender.com/verify/${accessToken}"
                                style="
                                    background-color: #0f766e;
                                    color: #ffffff;
                                    padding: 12px 20px;
                                    text-decoration: none;
                                    border-radius: 6px;
                                    font-weight: bold;
                                    display: inline-block;
                                "
                            >
                                Verify Email ✅
                            </a>
                        </div>

                        <p style="color: #555;">
                            If you didn’t create this account, you can safely ignore this email.
                        </p>

                        <p style="color: #777; font-size: 14px;">
                            This verification link will expire for security reasons.
                        </p>

                        <hr style="border: none; border-top: 1px solid #eee;" />

                        <p style="color: #999; font-size: 13px; text-align: center;">
                            © ${new Date().getFullYear()} Your App Name. All rights reserved.
                        </p>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailConfigurations);

        return { success: true };
    } catch (error) {
        console.error("Email sending failed:", error.message);
        throw new Error("Invalid email address or email not found");
    }
};

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const reduxUser = useSelector((state) => state.user.user);

  const [email, setEmail] = useState(reduxUser?.email || "");
  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const passwordsMatch =
    newPassword && confirmPassword && newPassword === confirmPassword;

  // 1️⃣ Generate OTP
  const handleGenerateOtp = async () => {
    if (!email) return toast.error("Email is required");

    try {
      setLoading(true);
      const res = await api.post("/user/forgot-password", { email });
      toast.success(res.data.message);
      setOtpSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // 2️⃣ Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) return toast.error("OTP is required");

    try {
      setLoading(true);
      const res = await api.post(`/user/verify-otp/${email}`, { otp });
      toast.success(res.data.message);
      setOtpVerified(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // 3️⃣ Change Password
  const handleChangePassword = async () => {
    try {
      setLoading(true);
      const res = await api.post(`/user/change-password/${email}`, {
        newPassword,
        confirmPassword,
      });
      toast.success(res.data.message);
      navigate("/password-changed");
    } catch (error) {
      toast.error(error.response?.data?.message || "Password update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-2">
          Forgot Password
        </h2>

        {/* INFO MESSAGE */}
        {!otpSent && (
          <p className="text-sm text-gray-600 text-center mb-4">
            We will send a 6-digit OTP to your registered email.
          </p>
        )}

        {otpSent && !otpVerified && (
          <p className="text-sm text-gray-600 text-center mb-4">
            Check your inbox and enter the 6-digit OTP.
          </p>
        )}

        {otpVerified && (
          <p className="text-sm text-gray-600 text-center mb-4">
            Create a new password for your account.
          </p>
        )}

        {/* EMAIL */}
        {!otpSent && (
          <>
            <Input
              value={email}
              disabled={!!reduxUser?.email}
              placeholder="Registered Email"
              className="mb-3"
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button
              onClick={handleGenerateOtp}
              disabled={loading}
              className="w-full bg-teal-600 mt-2 hover:bg-teal-700"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </>
        )}

        {/* OTP */}
        {otpSent && !otpVerified && (
          <>
            <Input
              placeholder="Enter 6-digit OTP"
              className="mb-3"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <Button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-teal-600 mt-2 hover:bg-teal-700"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
          </>
        )}

        {/* PASSWORD RESET */}
        {otpVerified && (
          <>
            <div className="relative mt-2">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                className="mb-3"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              {showPassword ? (
                <EyeOff
                  className="w-5 h-5 text-gray-500 absolute right-4 top-3 cursor-pointer"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <Eye
                  className="w-5 h-5 text-gray-500 absolute right-4 top-3 cursor-pointer"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>

            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="mb-2"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {confirmPassword && !passwordsMatch && (
              <p className="text-sm text-red-500 mb-2">
                Passwords do not match
              </p>
            )}

            <Button
              disabled={!passwordsMatch || loading}
              onClick={handleChangePassword}
              className={`w-full mt-2 ${
                passwordsMatch
                  ? "bg-teal-600 hover:bg-teal-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {loading ? "Updating password..." : "Continue"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

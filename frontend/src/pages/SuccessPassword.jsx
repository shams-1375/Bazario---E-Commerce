import React from "react";
import { CheckCircle } from "lucide-react"; // success icon
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const OrderSuccess = () => {
  const { user } = useSelector(store => store.user)
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="flex justify-center">
          <CheckCircle className="h-20 w-20 text-green-500" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold mt-6 text-gray-800">
          🔐 Password Updated Successfully
        </h1>

        {/* Message */}
        <p className="text-gray-600 mt-2">
          Your password has been changed successfully.
          <br/>
          You can now log in using your new password.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => navigate("/products")}
            className="w-full bg-teal-600 text-white py-3 rounded-xl hover:bg-teal-700 transition"
          >
            Continue Shopping
          </button>
          <button
            onClick={() =>
              navigate(`/profile/${user._id}`, {
                state: { tab: "profile" }
              })
            }
            className="w-full bg-teal-600 text-white py-3 rounded-xl hover:bg-teal-700 transition"
          >
            Back to Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess

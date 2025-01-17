import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const verifyEmail = async () => {
    try {
      const token = window.location.pathname.split("/").pop();
      const { data } = await API.post("/auth/verify-email", { token });
      localStorage.setItem(
        "validateAccount",
        JSON.stringify(data.isEmailVerified)
      );
      setMessage(data.message);
      let countdown = 3;
      const interval = setInterval(() => {
        if (countdown > 0) {
          setMessage(`Redirecting in ${countdown}...`);
          countdown--;
        } else {
          clearInterval(interval);
          navigate("/dashboard");
        }
      }, 1000);
    } catch (error) {
      setMessage("Email verification failed.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center">Verify Email</h1>

      <button
        onClick={verifyEmail}
        className="w-full bg-blue-500 text-white p-2 rounded"
      >
        Verify Email
      </button>

      {message && <div className="text-center">{message}</div>}
    </div>
  );
};

export default VerifyEmail;

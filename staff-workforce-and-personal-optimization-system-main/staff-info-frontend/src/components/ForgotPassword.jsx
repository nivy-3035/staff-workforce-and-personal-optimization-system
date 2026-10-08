import React, { useState } from "react";
import { sendOtp, resetPasswordOtp } from "../api/authApi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSendOtp = async () => {
    try {
      setError(""); setMessage("");
      const res = await sendOtp(email);
      if (res.message) {
        setOtpSent(true);
        setMessage(res.message);
      }
    } catch (err) {
      setError(err.message || "Server error");
    }
  };

  const handleResetPassword = async () => {
    try {
      setError(""); setMessage("");
      const res = await resetPasswordOtp(email, otp, newPwd);
      if (res.message) {
        setMessage(res.message);
        setOtpSent(false);
        setEmail(""); setOtp(""); setNewPwd("");
      }
    } catch (err) {
      setError(err.message || "Server error");
    }
  };

  return (
    <div style={container}>
      <div style={card}>
        <h2 style={title}>Forgot Password</h2>
        {!otpSent ? (
          <>
            <input type="email" placeholder="Registered Email" value={email} onChange={(e) => setEmail(e.target.value)} style={input} />
            <button onClick={handleSendOtp} style={button}>Send OTP</button>
          </>
        ) : (
          <>
            <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} style={input} />
            <input type="password" placeholder="New Password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} style={input} />
            <button onClick={handleResetPassword} style={button}>Reset Password</button>
          </>
        )}
        {error && <p style={errorText}>{error}</p>}
        {message && <p style={successText}>{message}</p>}
      </div>
    </div>
  );
};

const container = { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f4f6f8" };
const card = { width: "100%", maxWidth: "380px", background: "#fff", padding: "30px", borderRadius: "10px", boxShadow: "0 8px 25px rgba(0,0,0,0.1)" };
const title = { textAlign: "center", marginBottom: "20px", color: "#333" };
const input = { width: "100%", padding: "12px", marginBottom: "12px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px" };
const button = { width: "100%", padding: "12px", background: "#1976d2", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "15px" };
const errorText = { marginTop: "10px", color: "#d32f2f", textAlign: "center" };
const successText = { marginTop: "10px", color: "#2e7d32", textAlign: "center" };

export default ForgotPassword;

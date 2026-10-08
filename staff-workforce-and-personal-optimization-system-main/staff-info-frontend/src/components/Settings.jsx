import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { changePassword } from "../api/staffApi";

const Settings = () => {
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const containerStyle = { display: "flex" };
  const mainStyle = {
    flex: 1,
    maxWidth: "400px",
    margin: "2rem auto",
    background: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 0 15px #cdcdcd",
  };
  const inputStyle = {
    width: "100%",
    padding: "8px",
    margin: "0.6rem 0",
    border: "1px solid #bfcbe6",
    borderRadius: "6px",
  };
  const btnStyle = {
    background: "#32476d",
    color: "#fff",
    padding: "10px",
    width: "100%",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    marginTop: "0.6rem",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const username = localStorage.getItem("adminUsername"); // logged in admin

    if (!username) {
      setError("No logged-in admin found");
      return;
    }

    try {
      const response = await changePassword(username, currentPwd, newPwd);

      // Backend response: { message: "..." }
      if (response.message === "Password updated successfully") {
        setSuccess("Password updated successfully");
        setCurrentPwd("");
        setNewPwd("");
      } else {
        setError(response.message);
      }
    } catch (err) {
      // Shows backend error message
      setError(err.message || "Failed to change password");
    }
  };

  return (
    <div style={containerStyle}>
      <Sidebar />
      <main style={mainStyle}>
        <h2 style={{ fontWeight: "bold", color: "#32476d", marginBottom: "1.2rem" }}>
          Change Password
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Old Password"
            value={currentPwd}
            onChange={(e) => setCurrentPwd(e.target.value)}
            style={inputStyle}
            required
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
            style={inputStyle}
            required
          />

          <button type="submit" style={btnStyle}>Change</button>

          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
        </form>
      </main>
    </div>
  );
};

export default Settings;
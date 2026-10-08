import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaArrowLeft,FaSpinner } from "react-icons/fa";
import logo from "../components/logo.jpeg";
import { signin } from "../api/authApi";
import bgImage from "./admin.jpeg";


const SignIn = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setIsLoading(true);

    try {
      const res = await signin(username, password);

      if (res.message === "Login successful") {
        const role = res.role;
        localStorage.setItem("role", role);
        localStorage.setItem("username", res.user.username);
        localStorage.setItem("staffId", res.user.staffId);

        if (onLogin) onLogin(role);
        setMessage(`${role.toUpperCase()} login successful`);

        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        setIsError(true);
        setMessage(res.message || "Login failed");
      }
    } catch (err) {
      setIsError(true);
      setMessage(err.message || "Login failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Background Image */}
      <div style={{ ...styles.bgImage, backgroundImage: `url(${bgImage})` }} />
      
      {/* Gradient Overlay */}
      <div style={styles.gradientOverlay} />
      
      {/* Blur Overlay */}
      <div style={styles.blurOverlay} />
      
      {/* Decorative Orbs */}
      <div style={styles.orb1} />
      <div style={styles.orb2} />

      {/* Content */}
      <div style={styles.content}>
        <div style={styles.card}>
          {/* Back Button */}
          <div style={styles.backButton} onClick={() => navigate("/")}>
            <FaArrowLeft style={{ fontSize: "14px" }} />
            <span>Back to Home</span>
          </div>

          {/* Logo */}
          <div style={styles.logoContainer}>
            <img src={logo} alt="Logo" style={styles.logo} />
          </div>

          {/* University Name */}
          <h1 style={styles.title}>Annamalai University</h1>

          {/* Department Name */}
          <p style={styles.subtitle}>Department of Information Technology</p>

          {/* Form */}
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Username */}
            <div style={styles.inputGroup}>
              <FaUser style={styles.inputIcon} />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
                required
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div style={styles.inputGroup}>
              <FaLock style={styles.inputIcon} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <button type="submit" style={styles.button} disabled={isLoading}>
              {isLoading ? (
                <span style={styles.loadingContent}>
                  <FaSpinner style={styles.spinner} />
                  Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Forgot Password */}
            <div style={styles.forgotPassword}>
              <a href="/forgot-password" style={styles.link}>
                Forgot Password?
              </a>
            </div>

            {/* Message */}
            {message && (
              <div
                style={{
                  ...styles.message,
                  backgroundColor: isError ? "rgba(239, 68, 68, 0.1)" : "rgba(34, 197, 94, 0.1)",
                  color: isError ? "#ef4444" : "#22c55e",
                }}
              >
                {message}
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <p style={styles.footer}>© 2024 Annamalai University. All rights reserved.</p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
  },
  bgImage: {
    position: "absolute",
    inset: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  gradientOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient( rgba(115, 156, 246, 0.68) 100%)",
  },
  blurOverlay: {
    position: "absolute",
    inset: 0,
    backdropFilter: "blur(4px)",
  },
  orb1: {
    position: "absolute",
    top: "80px",
    left: "80px",
    width: "288px",
    height: "288px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "50%",
    filter: "blur(60px)",
    animation: "pulse 3s ease-in-out infinite",
  },
  orb2: {
    position: "absolute",
    bottom: "80px",
    right: "80px",
    width: "384px",
    height: "384px",
    background: "rgba(167, 139, 250, 0.2)",
    borderRadius: "50%",
    filter: "blur(60px)",
    animation: "pulse 3s ease-in-out infinite 1.5s",
  },
  content: {
    position: "relative",
    zIndex: 10,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "rgba(255, 255, 255, 0.92)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "40px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    animation: "slideUp 0.6s ease-out",
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#4f46e5",
    fontWeight: 600,
    marginBottom: "24px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "opacity 0.2s",
  },
  logoContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "24px",
  },
  logo: {
    width: "96px",
    height: "96px",
    borderRadius: "16px",
    objectFit: "cover",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
    border: "4px solid rgba(255, 255, 255, 0.5)",
    animation: "float 6s ease-in-out infinite",
  },
  title: {
    textAlign: "center",
    fontSize: "28px",
    fontWeight: 700,
    color: "#1e1b4b",
    marginBottom: "8px",
    margin: 0,
  },
  subtitle: {
    textAlign: "center",
    color: "#4f46e5",
    fontWeight: 700,
    fontSize: "18px",
    marginBottom: "32px",
    marginTop: "8px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#94a3b8",
    fontSize: "16px",
    transition: "color 0.2s",
  },
  input: {
    width: "100%",
    padding: "14px 16px 14px 48px",
    fontSize: "16px",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    background: "rgba(241, 245, 249, 0.5)",
    outline: "none",
    transition: "all 0.2s",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "14px 24px",
    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    color: "#fff",
    fontWeight: 600,
    fontSize: "16px",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 4px 14px rgba(79, 70, 229, 0.4)",
  },
  loadingContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  spinner: {
    animation: "spin 1s linear infinite",
  },
  forgotPassword: {
    textAlign: "center",
  },
  link: {
    color: "#4f46e5",
    fontWeight: 600,
    textDecoration: "none",
    fontSize: "14px",
  },
  message: {
    textAlign: "center",
    fontWeight: 600,
    padding: "12px 16px",
    borderRadius: "12px",
    animation: "fadeIn 0.3s ease-out",
  },
  footer: {
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: "14px",
    marginTop: "24px",
  },
};

// Add CSS keyframes via style tag
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default SignIn;

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../auth/useAuth";
import "../styles/auth.css";

export default function LoginUser() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showOtp, setShowOtp] = useState(false);
  const [userId, setUserId] = useState(null);
  const [otp, setOtp] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        email,
        password
      });

      if (res.data.twoFactorRequired) {
        setUserId(res.data.userId);
        setShowOtp(true);
      } else {
        alert("Unexpected response");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/verify-otp", {
        userId,
        otp
      });

      login(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="auth-page">
      {!showOtp ? (
        <form className="auth-card" onSubmit={handleSubmit}>
          <div className="steam-auth-header">
            <svg className="steam-guard-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a10 10 0 0 0-10 10c0 4.67 3.2 8.59 7.54 9.65l3.27-4.52a3.47 3.47 0 0 1-1.31-2.73c0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5h-.16l-4.57 3.24A10 10 0 1 0 12 2zm2.5 11.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
            </svg>
            <h1>STEAM CLONE</h1>
            <h2>SIGN IN TO YOUR ACCOUNT</h2>
          </div>

          <label style={{ fontSize: "11px", color: "#66c0f4", marginBottom: "6px", fontWeight: "600" }}>STEAM ACCOUNT EMAIL</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label style={{ fontSize: "11px", color: "#66c0f4", marginBottom: "6px", fontWeight: "600" }}>PASSWORD</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">SIGN IN</button>

          <div className="auth-links">
            <p>
              Don't have a Steam account? <Link to="/register">Create a free account</Link>
            </p>

            <p>
              Employee portal → <Link to="/employee/login">Click here</Link>
            </p>
          </div>
        </form>
      ) : (
        <form className="auth-card" onSubmit={handleVerify}>
          <div className="steam-auth-header">
            <svg className="steam-guard-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8s0 0 0 0z"/>
            </svg>
            <h1>STEAM GUARD 2FA</h1>
            <h2>ENTER SECURITY CODE</h2>
          </div>

          <p style={{ fontSize: "12px", color: "#c7d5e0", marginBottom: "16px", textAlign: "center" }}>
            We've sent a 6-character Steam Guard verification code to your email.
          </p>

          <input
            type="text"
            placeholder="Enter OTP Code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            style={{ textAlign: "center", letterSpacing: "4px", fontSize: "18px", fontWeight: "bold" }}
          />

          <button type="submit">SUBMIT CODE</button>

          <div className="auth-links">
            <p>
              Back to{" "}
              <span
                style={{ cursor: "pointer", color: "#66c0f4", textDecoration: "underline" }}
                onClick={() => setShowOtp(false)}
              >
                Sign In
              </span>
            </p>
          </div>
        </form>
      )}
    </div>
  );
}

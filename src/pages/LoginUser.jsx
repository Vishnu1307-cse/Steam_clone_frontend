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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data.twoFactorRequired) {
        setUserId(res.data.userId);
        setShowOtp(true);
      } else {
        alert("Unexpected response");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/verify-otp", { userId, otp });
      login(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {!showOtp ? (
        /* ---- SIGN IN FORM ---- */
        <form className="auth-card" onSubmit={handleSubmit}>
          <div className="steam-auth-header">
            <svg className="steam-guard-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a10 10 0 0 0-10 10c0 4.67 3.2 8.59 7.54 9.65l3.27-4.52a3.47 3.47 0 0 1-1.31-2.73c0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5h-.16l-4.57 3.24A10 10 0 1 0 12 2zm2.5 11.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
            </svg>
            <h1>STEAM CLONE</h1>
            <h2>Sign in to your account</h2>
          </div>

          <label className="auth-label">Steam Account Email</label>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="auth-label">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </button>

          <div className="auth-links">
            <p>Don't have an account? <Link to="/register">Create a free account</Link></p>
            <p>Employee portal → <Link to="/employee/login">Click here</Link></p>
          </div>
        </form>
      ) : (
        /* ---- OTP FORM ---- */
        <form className="auth-card" onSubmit={handleVerify}>
          <div className="steam-auth-header">
            <svg className="steam-guard-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8s0 0 0 0z"/>
            </svg>
            <h1>STEAM GUARD</h1>
            <h2>2-Factor Authentication</h2>
          </div>

          <p className="otp-hint-text">
            A 6-digit Steam Guard code has been sent to your email.<br />
            Please check your inbox and enter it below.
          </p>

          <label className="auth-label">Steam Guard Code</label>
          <input
            type="text"
            placeholder="— — — — — —"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            maxLength={6}
            className="otp-input"
          />

          <button type="submit" disabled={loading}>
            {loading ? "VERIFYING..." : "SUBMIT CODE"}
          </button>

          <div className="auth-links">
            <p>
              Wrong account?{" "}
              <span
                style={{ cursor: "pointer" }}
                onClick={() => setShowOtp(false)}
              >
                ← Back to Sign In
              </span>
            </p>
          </div>
        </form>
      )}
    </div>
  );
}

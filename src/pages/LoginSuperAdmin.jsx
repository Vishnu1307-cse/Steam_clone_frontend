import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../auth/useAuth";
import "../styles/auth.css";

export default function LoginSuperAdmin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState("login"); // login or register
  const [showOtp, setShowOtp] = useState(false);
  const [showTokenVerification, setShowTokenVerification] = useState(false);
  const [superAdminId, setSuperAdminId] = useState(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regEmployeeId, setRegEmployeeId] = useState("");
  const [secretKey, setSecretKey] = useState("");

  // OTP state
  const [otp, setOtp] = useState("");

  // Token verification state
  const [verifyToken, setVerifyToken] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/superadmin/login", {
        email: loginEmail,
        password: loginPassword
      });

      if (res.data.twoFactorRequired) {
        setSuperAdminId(res.data.superAdminId);
        setShowOtp(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const handleRequestSuperAdmin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/superadmin/request", {
        username: regUsername,
        email: regEmail,
        password: regPassword,
        employeeId: regEmployeeId,
        secretKey
      });

      alert(res.data.message || "Registration request sent! Check your email for the approval token.");
      setShowTokenVerification(true);
      setRegUsername("");
      setRegEmail("");
      setRegPassword("");
      setRegEmployeeId("");
      setSecretKey("");
    } catch (err) {
      alert(err.response?.data?.message || "Request failed");
    }
  };

  const handleVerifyToken = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/superadmin/register", {
        token: verifyToken
      });

      alert(res.data.message || "Super admin account created successfully! Please login.");
      setCurrentTab("login");
      setVerifyToken("");
      setShowTokenVerification(false);
    } catch (err) {
      alert(err.response?.data?.message || "Token verification failed");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/superadmin/verify-otp", {
        superAdminId,
        otp
      });

      login(res.data.token);
      navigate("/superadmin/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="auth-page">
      {!showOtp && !showTokenVerification ? (
        <div className="auth-card">
          <h1>Steam Clone</h1>
          <h2>Super Admin Panel</h2>

          <div className="auth-tabs">
            <button
              className={`tab-button ${currentTab === "login" ? "active" : ""}`}
              onClick={() => setCurrentTab("login")}
            >
              Login
            </button>
            <button
              className={`tab-button ${currentTab === "register" ? "active" : ""}`}
              onClick={() => setCurrentTab("register")}
            >
              Request Account
            </button>
          </div>

          {currentTab === "login" ? (
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />

              <button type="submit">Login</button>

              <div className="auth-links">
                <p>
                  No account? <a href="#" onClick={() => setCurrentTab("register")}>Request one</a>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRequestSuperAdmin}>
              <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "16px" }}>
                Request super admin access with your credentials and secret key.
              </p>

              <input
                type="text"
                placeholder="Username"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                required
              />

              <input
                type="email"
                placeholder="Email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Employee ID"
                value={regEmployeeId}
                onChange={(e) => setRegEmployeeId(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Secret Key"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                required
              />

              <button type="submit">Request Super Admin Access</button>

              <div className="auth-links">
                <p>
                  Already have an account? <a href="#" onClick={() => setCurrentTab("login")}>Login</a>
                </p>
              </div>
            </form>
          )}
        </div>
      ) : showTokenVerification ? (
        <form className="auth-card" onSubmit={handleVerifyToken}>
          <h1>Verify Token</h1>
          <p>Enter the approval token sent to your registered email address.</p>

          <input
            type="text"
            placeholder="Approval Token"
            value={verifyToken}
            onChange={(e) => setVerifyToken(e.target.value)}
            required
          />

          <button type="submit">Verify Token</button>

          <div className="auth-links">
            <p>
              <a href="#" onClick={() => setShowTokenVerification(false)}>Back to Login</a>
            </p>
          </div>
        </form>
      ) : (
        <form className="auth-card" onSubmit={handleVerifyOtp}>
          <h1>Verify OTP</h1>
          <p>We've sent a one-time code to your email. It expires in 5 minutes.</p>

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <button type="submit">Verify</button>

          <div className="auth-links">
            <p>
              <a href="#" onClick={() => setShowOtp(false)}>Back to Login</a>
            </p>
          </div>
        </form>
      )}
    </div>
  );
}

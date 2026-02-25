import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../auth/useAuth";
import "../styles/auth.css";

export default function LoginAdmin() {
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
      } else if (res.data.token) {
        login(res.data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Employee login failed");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/verify-otp", { userId, otp });
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
          <h1>Steam Clone</h1>
          <h2>Employee Login</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>

          <div className="auth-links">
            <p>
              Need employee access? <Link to="/employee/register">Request employee account</Link>
            </p>

            <p>
              User? <Link to="/">Login here</Link>
            </p>
          </div>
        </form>
      ) : (
        <form className="auth-card" onSubmit={handleVerify}>
          <h1>Enter OTP</h1>
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
              Back to <a onClick={() => setShowOtp(false)}>login</a>
            </p>
          </div>
        </form>
      )}
    </div>
  );
}

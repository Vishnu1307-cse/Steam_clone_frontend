import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/auth.css";

export default function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState("details");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState(null);

  const submitRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/register", form);
      setUserId(res.data.userId);
      setStep("otp");
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/verify-register-otp", {
        userId,
        otp
      });

      alert("Account verified! Please login.");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "OTP invalid");
    }
  };

  return (
    <div className="auth-page">
      {step === "details" ? (
        <form className="auth-card" onSubmit={submitRegister}>
          <h1>Steam Clone</h1>
          <h2>Create Account</h2>

          <input
            placeholder="Username"
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required
          />

          <button>Create Account</button>
        </form>
      ) : (
        <form className="auth-card" onSubmit={verifyOtp}>
          <h1>Verify Email</h1>
          <p>Enter the OTP sent to your email.</p>

          <input
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <button>Verify</button>
        </form>
      )}
    </div>
  );
}

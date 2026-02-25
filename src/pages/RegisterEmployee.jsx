import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "../styles/auth.css";

export default function RegisterEmployee() {
  const [step, setStep] = useState(1);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [token, setToken] = useState("");

  // STEP 1: Request employee token
  const requestToken = async (e) => {
    e.preventDefault();

    try {
      await api.post("/employee/request", {
        username,
        email,
        password,
        employeeId
      });

      alert("Employee token request sent. Contact company email.");
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || "Request failed");
    }
  };

  // STEP 2: Confirm employee registration
  const confirmEmployee = async (e) => {
    e.preventDefault();

    try {
      await api.post("/employee/approve", {
        email,
        token
      });

      alert("Employee account created. You can now log in.");
    } catch (err) {
      alert(err.response?.data?.message || "Approval failed");
    }
  };

  return (
    <div className="auth-page">
      <form
        className="auth-card"
        onSubmit={step === 1 ? requestToken : confirmEmployee}
      >
        <h1>Steam Clone</h1>
        <h2>Employee Registration</h2>

        {step === 1 && (
          <>
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              placeholder="Employee ID"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Request Employee Token</button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              placeholder="Enter Employee Token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />

            <button type="submit">Confirm Registration</button>
          </>
        )}

        <div className="auth-links">
          <p>
            Already an employee? <Link to="/employee/login">Login</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

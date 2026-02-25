import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function RegisterAdmin() {
  const [step, setStep] = useState(1);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  // STEP 1: Request employee token
  const requestToken = async (e) => {
    e.preventDefault();

    await api.post("/employee/request", {
      username,
      email,
      password
    });

    alert("Employee token request sent. Contact company email.");
    setStep(2);
  };

  // STEP 2: Confirm employee registration
  const confirmAdmin = async (e) => {
    e.preventDefault();

    await api.post("/employee/approve", {
      email,
      token
    });

    alert("Employee account created. You can now log in.");
  };

  return (
    <form onSubmit={step === 1 ? requestToken : confirmAdmin}>
      <h2>Employee Registration</h2>

      {step === 1 && (
        <>
          <input
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button>Request Employee Token</button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            placeholder="Enter Employee Token"
            onChange={(e) => setToken(e.target.value)}
          />

          <button>Confirm Registration</button>
        </>
      )}

      <p>
        Already an employee? <Link to="/employee">Login</Link>
      </p>
    </form>
  );
}

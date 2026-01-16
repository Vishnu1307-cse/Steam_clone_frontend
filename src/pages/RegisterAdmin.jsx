import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function RegisterAdmin() {
  const [step, setStep] = useState(1);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  // STEP 1: Request admin token
  const requestToken = async (e) => {
    e.preventDefault();

    await api.post("/admin/request", {
      username,
      email,
      password
    });

    alert("Admin token request sent. Contact company email.");
    setStep(2);
  };

  // STEP 2: Confirm admin registration
  const confirmAdmin = async (e) => {
    e.preventDefault();

    await api.post("/admin/approve", {
      email,
      token
    });

    alert("Admin account created. You can now log in.");
  };

  return (
    <form onSubmit={step === 1 ? requestToken : confirmAdmin}>
      <h2>Admin Registration</h2>

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

          <button>Request Admin Token</button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            placeholder="Enter Admin Token"
            onChange={(e) => setToken(e.target.value)}
          />

          <button>Confirm Registration</button>
        </>
      )}

      <p>
        Already an admin? <Link to="/admin">Login</Link>
      </p>
    </form>
  );
}

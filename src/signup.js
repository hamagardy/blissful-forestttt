import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase"; // Correct import of auth

function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created successfully! You can now log in.");
      navigate("/login");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "10%" }}>
      <h2>Sign Up</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        style={{ margin: "10px", padding: "10px", width: "300px" }}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        style={{ margin: "10px", padding: "10px", width: "300px" }}
      />
      <button
        onClick={handleSignUp}
        style={{ padding: "10px 20px", margin: "10px" }}
      >
        Sign Up
      </button>
      <button
        onClick={() => navigate("/login")}
        style={{ padding: "10px 20px", margin: "10px" }}
      >
        Back to Login
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default SignUp;

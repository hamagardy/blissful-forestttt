import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "./firebase"; // Correct import of auth

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoggedInUser(auth.currentUser);
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent! Check your inbox.");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "10%" }}>
      <h2>Login</h2>
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
        onClick={handleLogin}
        style={{ padding: "10px 20px", margin: "10px" }}
      >
        Login
      </button>
      <button
        onClick={() => navigate("/signup")}
        style={{ padding: "10px 20px", margin: "10px" }}
      >
        Sign Up
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loggedInUser && (
        <div>
          <h3>Logged In as:</h3>
          <p>Email: {loggedInUser.email}</p>
        </div>
      )}
    </div>
  );
}

export default Login;

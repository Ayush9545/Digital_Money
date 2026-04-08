import { useState } from "react";

function Register({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    if (!email || !password) {
      setMessage("Please fill all fields ⚠️");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters ⚠️");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/auth/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Registration successful ✅ You can now login");
      } else {
        setMessage(data.message);
      }
    } catch {
      setMessage("Server error ❌");
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleRegister}>Register</button>

      <p>{message}</p>

      <p style={{ textAlign: "center" }}>
        Already have an account?
        <button onClick={onSwitch}> Login</button>
      </p>
    </div>
  );
}

export default Register;
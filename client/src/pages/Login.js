import { useState } from "react";

function Login({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Please fill all fields ⚠️");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        window.location.reload(); // refresh to load dashboard
      } else {
        setMessage(data.message);
      }
    } catch {
      setMessage("Server error ❌");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>

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

      <button onClick={handleLogin}>Login</button>

      <p>{message}</p>

      <p style={{ textAlign: "center" }}>
        Don't have an account?
        <button onClick={onSwitch}> Register</button>
      </p>
    </div>
  );
}

export default Login;
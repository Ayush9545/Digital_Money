import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import Logo from "../components/Logo";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/auth/registration",
        {
          email,
          password,
        }
      );

      alert(response.data.message);
      navigate("/");

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
        "Registration Failed"
      );
    }
  };

  // return (
  //   <div>
  //     <h1>Register</h1>

  //     <form onSubmit={handleRegister}>
  //       <div>
  //         <label>Email</label>
  //         <br />
  //         <input
  //           type="email"
  //           value={email}
  //           onChange={(e) => setEmail(e.target.value)}
  //         />
  //       </div>

  //       <br />

  //       <div>
  //         <label>Password</label>
  //         <br />
  //         <input
  //           type="password"
  //           value={password}
  //           onChange={(e) => setPassword(e.target.value)}
  //         />
  //       </div>

  //       <br />

  //       <button type="submit">
  //         Register
  //       </button>
  //     </form>
  //   </div>
  // );

  return (
    <div className="auth-page">
      {/* <Logo /> */}
      <div className="auth-card">
        <h1>PayGuard</h1>
        <p className="subtitle">Create Your Account</p>
  
        <form onSubmit={handleRegister}>
          <label>Email</label>
  
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
  
          <label>Password</label>
  
          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
  
          <button type="submit">
            Register
          </button>
  
          <p className="register-link">
            Already have an account?{" "}
            <span onClick={() => navigate("/")}>
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
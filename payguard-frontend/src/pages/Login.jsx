import { useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <h1>Login</h1>

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          alert("Button clicked!");

          try {
            const response = await axios.post(
              "http://localhost:3000/auth/login",
              {
                email,
                password,
              }
            );
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user_id", response.data.user_id);

            // To get the token and user_id in the consol ------------>
            // console.log(localStorage.getItem("token"));
            // console.log(localStorage.getItem("user_id"));

            console.log("SUCCESS:", response.data.user_id);

            alert(response.data.message);
            navigate("/dashboard");

          } catch (error) {
            
            console.log("FULL ERROR:", error);
            console.log("RESPONSE:", error.response);
            console.log("MESSAGE:", error.message);

            alert("Login Failed");
          }
        }}
      >
        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Password</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;

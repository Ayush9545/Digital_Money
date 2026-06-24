import { useState } from "react";
import axios from "axios";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <h1>Login</h1>

      <form
      onSubmit={async(e) => {
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
          console.log("SUCCESS:", response.data);

alert(response.data.message);
          // alert("Login Success");
          // console.log(response.data);
      
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

        <button type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
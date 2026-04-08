import { useState } from "react";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  const token = localStorage.getItem("token");
  const [isLogin, setIsLogin] = useState(true);

  // If logged in → show dashboard
  if (token) {
    return <Dashboard />;
  }

  // If NOT logged in → show login/register
  return (
    <div>
      {isLogin ? (
        <Login onSwitch={() => setIsLogin(false)} />
      ) : (
        <Register onSwitch={() => setIsLogin(true)} />
      )}
    </div>
  );
}

export default App;
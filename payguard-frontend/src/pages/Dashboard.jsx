import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    fetchBalance();
  }, []);

  async function fetchBalance() {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("http://localhost:3000/api/balance", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBalance(response.data.balance);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <h1>PayGuard</h1>
      <h2>Current Balance</h2>
      <h1>₹{balance}</h1>
    </div>
  );
}

export default Dashboard;

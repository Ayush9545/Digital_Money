import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, []);

  async function handleTransfer() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/transfer",
        {
          receiver_id: Number(receiverId),
          amount: Number(amount),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);

      fetchBalance();
      fetchTransactions();
      setReceiverId("");
      setAmount("");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Transfer Failed");
    }
  }

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

  async function fetchTransactions() {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:3000/api/transactions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);

      setTransactions(response.data.history);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <h1>PayGuard</h1>
      <h2>Current Balance</h2>
      <h1>₹{balance}</h1>
      <h2>Transfer Money</h2>

      <div>
        <label>Receiver User ID</label>
        <br />
        <input
          type="number"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
        />
      </div>

      <br />

      <div>
        <label>Amount</label>
        <br />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <br />
      <button onClick={handleTransfer}>Send Money</button>

      <h2>Recent Transactions</h2>
      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <ul>
          {transactions.map((transaction) => (
            <li key={transaction.transaction_id}>₹{transaction.amount}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;

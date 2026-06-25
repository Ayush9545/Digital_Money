import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");
  const [myAccount, setMyAccount] = useState(null);

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
      setMyAccount(Number(response.data.myAccount));
    } catch (error) {
      console.log(error);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");

    navigate("/");
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
          {transactions.map((transaction) => {
            console.log("My Account:", myAccount);
            console.log("Transaction:", transaction);

            const isSent = transaction.sender_wallet_id === myAccount;
            return (
              <li key={transaction.id}>
                <h4>
                  {isSent ? "⬇️ Sent" : "⬆️ Received"} ₹{transaction.amount}
                </h4>
                <p>
                  {isSent
                    ? `To Account ${transaction.receiver_wallet_id}`
                    : `From Account ${transaction.sender_wallet_id}`}
                </p>
                <small>
                  {new Date(transaction.timestamp).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </small>
              </li>
            );
          })}
        </ul>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;

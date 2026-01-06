import "dotenv/config";
import express from "express";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE, 
    password: process.env.DB_PASSWORD,     
    port: process.env.DB_PORT,
});

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        status: "Live",
        message: "PayGuard Bank API is running smoothly 🚀"
    });
    console.log("This is home page.")
})

app.post("/transfer", async (req, res) => {
    const sender_id = req.body.sender_id;
    const receiver_id = req.body.receiver_id;
    const amount = req.body.amount;
    const client = await db.connect();
    try {
        await client.query('BEGIN');
        const senderRes = await client.query(
            "SELECT acc_no, balance FROM Wallets WHERE user_id = $1 FOR UPDATE",
            [sender_id]
        );
        const senderWallet = senderRes.rows[0];
        if (!senderWallet) {
            throw new Error("Sender not found");
        }
        if (Number(senderWallet.balance) < Number(amount)) {
            throw new Error("Insufficient funds");
        }
        await client.query(
            "UPDATE Wallets SET balance = balance - $1 WHERE user_id = $2",
            [amount, sender_id]
        );
        const receiverRes = await client.query(
            "UPDATE Wallets SET balance = balance + $1 WHERE user_id = $2 RETURNING acc_no",
            [amount, receiver_id]
        );
        if (receiverRes.rowCount === 0) {
            throw new Error("Receiver not found");
        }
        const receiverAccNo = receiverRes.rows[0].acc_no;

        await client.query(
            "INSERT INTO transactions (amount, sender_wallet_id, receiver_wallet_id) VALUES ($1, $2, $3)",
            [amount, senderWallet.acc_no, receiverAccNo]
        );
        await client.query('COMMIT');
        res.json({ message: "Transaction Successful!" });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Transaction Error:", error);
        res.status(500).json({ 
            message: "Transaction Failed", 
            error: error.message 
        });
    } finally {
        client.release();
    }
})
// --- AUTO-FIX ROUTE ---
app.get("/init", async (req, res) => {
    try {
        const client = await db.connect();
        try {
            // 1. Drop old tables (Reset)
            await client.query("DROP TABLE IF EXISTS transactions CASCADE");
            await client.query("DROP TABLE IF EXISTS wallets CASCADE");
            await client.query("DROP TABLE IF EXISTS users CASCADE");

            // 2. Create Tables
            await client.query(`
                CREATE TABLE users (
                    user_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                    email TEXT NOT NULL UNIQUE,
                    password_hash TEXT NOT NULL
                );
                CREATE TABLE wallets (
                    acc_no BIGINT GENERATED ALWAYS AS IDENTITY (START WITH 1011 INCREMENT BY 1) PRIMARY KEY,
                    user_id INT REFERENCES users(user_id),
                    balance DECIMAL(10, 2) DEFAULT 0.00 CHECK (balance >= 0)
                );
                CREATE TABLE transactions (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    amount DECIMAL(10, 2) NOT NULL,
                    sender_wallet_id INT REFERENCES wallets(acc_no),
                    receiver_wallet_id INT REFERENCES wallets(acc_no),
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);

            // 3. Insert Data
            await client.query(`
                INSERT INTO users (email, password_hash) VALUES ('alice@test.com', 'pass123');
                INSERT INTO users (email, password_hash) VALUES ('bob@test.com', 'pass123');
                INSERT INTO wallets (user_id, balance) VALUES (1, 1000.00);
                INSERT INTO wallets (user_id, balance) VALUES (2, 500.00);
            `);

            res.send("✅ Success! Database tables created and data inserted.");
        } finally {
            client.release();
        }
    } catch (error) {
        res.status(500).send("❌ Error initializing DB: " + error.message);
    }
});
app.listen(port, () => {
    console.log(`Server is running on ${port}.`);
})
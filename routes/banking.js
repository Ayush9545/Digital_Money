import express from "express";
import db from "../db.js";
import authToken from "../middleware/authMiddleware.js"

const router = express.Router();

router.get("/me", authToken, (req, res) => {
    res.json({
        message: "User profile",
        user: req.user
    });
});

router.get("/balance", authToken, async (req, res) => {
    const user_id = req.user.id;

    try {
        const result = await db.query(
            "SELECT balance FROM wallets WHERE user_id = $1",
            [user_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" })
        }
        res.json({
            user_id: user_id,
            balance: result.rows[0].balance
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" })
    }
})

router.get("/transactions", authToken, async (req, res) => {
    const user_id = req.user.id;

    try {
        const wallet = await db.query(
            "SELECT acc_no FROM wallets WHERE user_id = $1",
            [user_id]
        );

        if (wallet.rows.length === 0) {
            return res.status(404).json({ message: "Wallet not found" });
        }

        const acc_no = wallet.rows[0].acc_no;

        const tran = await db.query(
            "SELECT * FROM transactions WHERE sender_wallet_id = $1 OR receiver_wallet_id = $1 ORDER BY timestamp DESC",
            [acc_no]
        );

        res.json({
            myAccount: acc_no,
            history: tran.rows
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

router.post("/transfer", authToken, async (req, res) => {
    const sender_id = req.user.id;
    const receiver_id = req.body.receiver_id;
    const amount = req.body.amount;
    const client = await db.connect();

    try {
        if (sender_id === receiver_id) {
            return res.status(400).json({
                message: "Sender and receiver cannot be the same"
            });
        }
        if (Number(amount) <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        await client.query('BEGIN');
        const senderRes = await client.query(
            "SELECT acc_no, balance FROM wallets WHERE user_id = $1 FOR UPDATE",
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
            "UPDATE wallets SET balance = balance - $1 WHERE user_id = $2",
            [amount, sender_id]
        );
        const receiverRes = await client.query(
            "UPDATE wallets SET balance = balance + $1 WHERE user_id = $2 RETURNING acc_no",
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

export default router;
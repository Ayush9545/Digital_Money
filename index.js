import express from "express";
import pg from "pg";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res)=>{
    res.json({ 
        status: "Live",  
        message: "PayGuard Bank API is running smoothly 🚀" 
    });
    console.log("This is home page.")
})

app.post("/transfer", async (req, res)=>{
    const sender_id = req.body.sender_id;
    const receiver_id = req.body.receiver_id;
    const amount=req.body.amount;
    const client = await db.connect();
    try {
        await client.query('BEGIN');
        await client.query('COMMIT');
        res.json({ message: "Transaction Started!" });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Transaction Error:", error);
        res.status(500).json({message: "Transaction Failed"});
    } finally {
        client.release();
    }
})

app.listen(port, ()=>{
    console.log(`Server is running on ${port}.`);
})
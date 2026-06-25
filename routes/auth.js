import express from "express";
import db from "../db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = express.Router();

router.get("/login", (req, res) => {
    res.json({ message: "This is login page" });
})

router.get("/registration", (req, res) => {
    res.json({ message: "This is resgistration page" });
})

router.post("/login", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const check_result = await db.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        if (check_result.rows.length === 0) {
            return res.status(404).json({message: "User not found!"});
        } 

        const user = check_result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({message: "Invalid password"});
        }

        const token = jwt.sign(
            { id: user.user_id, email: user.email }, 
            process.env.JWT_SECRET,                  
            { expiresIn: "1h" }                      
        );

        res.json({
            message: "Login successful!",
            token: token,
            user_id: user.user_id
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
})

router.post("/registration", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const check_result = await db.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        if (check_result.rows.length > 0) {
            return res.status(409).json({ message: "Email already exists" });
        } else {
            const hash_password = await bcrypt.hash(password, 10);

            const result = await db.query(
                "INSERT INTO users (email, password_hash) VALUES ($1,$2) RETURNING *",
                [email, hash_password]
            );
            const user_id = result.rows[0].user_id;
            
            await db.query(
                "INSERT INTO wallets (user_id, balance) VALUES ($1, $2)",
                [user_id, 0]
            );
            
            res.json({ message: "Resgister successfully!" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
        message: "Server Error"
    });
    }
})

export default router;
import express from "express";
import db from "./db.js";
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
        if (check_result === 0) {
            return res.status(404).json({message: "User not found!"});
        } else {
            
        }
    } catch (error) {
        console.log(error);
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
                "INSERT INTO users (email, password) VALUES ($1,$2) RETURNING *",
                [email, hash_password]
            );
            res.json({ message: "Resgister successfully!" });
        }
    } catch (error) {
        console.log(error);
    }
})

export default router;
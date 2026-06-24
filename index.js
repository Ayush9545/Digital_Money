import dotenv from "dotenv";
dotenv.config();

import express from "express";
import banking from "./routes/banking.js";
import auth from "./routes/auth.js";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        status: "Live",
        message: "PayGuard Bank API is running smoothly 🚀"
    });
    console.log("This is home page.")
})

app.use("/auth", auth);
app.use("/api", banking);

app.listen(port, () => {
    console.log(`Server is running on ${port}.`);
})
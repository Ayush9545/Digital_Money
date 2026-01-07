import express from "express";
import banking from "./routes/banking.js"

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        status: "Live",
        message: "PayGuard Bank API is running smoothly 🚀"
    });
    console.log("This is home page.")
})

app.use("/api", banking);

app.listen(port, () => {
    console.log(`Server is running on ${port}.`);
})
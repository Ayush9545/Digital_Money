import express from "express";
const app = express();
const post = 3000;

app.listen(port, ()=>{
    console.log(`Server is running on ${post}`);
})
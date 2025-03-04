import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnect from "./config/dbConnect";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

dbConnect().then(() => {
    app.listen(8000, () => console.log("Server is running on port 8000"));
})
.catch(()=>{
    console.log("Database connection failed");
})
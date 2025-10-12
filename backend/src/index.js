import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from"./routes/message.route.js";
import {app,server} from "./lib/socket.js";


dotenv.config();

app.use(cors({
    origin: 'https://gingle-chat-1.onrender.com',   
    credentials: true
}));

const PORT = process.env.PORT;

app.use(express.json({ limit: "200mb" }));
app.use(cookieParser());


app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes)

server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
    connectDB();
})
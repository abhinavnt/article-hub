import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import morgan from "morgan";

dotenv.config();
connectDB();
console.log("mongo db conected");

const app = express();
const CLIENT_URL = process.env.CLIENT_URL;

app.use(morgan("dev"));

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);






export default app;
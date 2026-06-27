// src/config/database.ts

// This file will eventually contain our MongoDB connection logic

// global imports 
import mongoose from "mongoose"

// local imports 
import { env } from "./env"

// connect to database atlas
export const connectDatabase = async () => {
    try {
        // connect to mongodb atlas 
        await mongoose.connect(env.MONGODB_URI)
        console.log("MongoDB connected successfully")
    } catch (error) {
        console.error("MongoDB connection failed", error)

        throw error
    }
}
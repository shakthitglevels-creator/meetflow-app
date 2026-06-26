// Library imports
import dotenv from "dotenv"

// load variables from .env to process.env 
dotenv.config()

// exports config values everywhere so we dont use process.env everywhere 
export const env = {
    PORT: process.env.PORT || "5000",
    NODE_ENV: process.env.NODE_ENV || "development"
}

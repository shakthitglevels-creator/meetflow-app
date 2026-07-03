// backend/src/server.ts - starts the server 

// library imports 
import dns from "dns"

// local imports 
import app from "./app";
import { env } from "./config/env";
import { connectDatabase } from "./config/database";
import { connectRedis } from "./config/redis";

// port issue solved by dns 
dns.setServers(["8.8.8.8", "8.8.4.4"])

// start the express server 
// app.listen(env.PORT, () => {
//     console.log(`Server is running on port ${env.PORT}`)
// })

// application startup - using bootstrap process server only starts after db redis all connects 
const bootstrap = async () => {
    try {
        
        // initialize database 
        await connectDatabase();

        // initialize redis 
        await connectRedis();

        // start HTTP server 
        const server = app.listen(env.PORT, () => {
            console.log(`Server running on port ${env.PORT}`)
        })
    } catch (error) {
        console.error("Application startup failed", error)
        process.exit(1)
    }
};

// Startup application
bootstrap()

// handle Crtl + C gracefully 
process.on("SIGINT", () => {
    console.log("SIGINT received")

    process.exit(0)
});

// handle docker/ kubernetes shutdown
process.on("SIGTERM", () => {
    console.log("SIGTERM received")
    process.exit(0);
});


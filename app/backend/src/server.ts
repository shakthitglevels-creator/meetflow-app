// backend/src/server.ts - starts the server 

// library imports 

// local imports 
import app from "./app";
import { env } from "./config/env";

// start the express server 
app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`)
})
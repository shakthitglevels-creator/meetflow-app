// src/backend purpose is to create and configure the express applications build the application do not start the server only server.ts starts the servern

// library imports
import express from "express";
import cors from "cors";

// local imports
import healthRouter from "./modules/health/health.routes";
import { notFoundMiddleware } from "./middleware/not-found.middleware";

// create express application
const app = express();

// allow request from the frontend
// what is app.use => means for every request run cors middleware first

app.use(cors());

// convert incoming json body into javascript objects
app.use(express.json());

// final endpoint GET /health
app.use("/health", healthRouter);

// notfound - middleware
app.use(notFoundMiddleware)


// export app so server can start it
export default app;

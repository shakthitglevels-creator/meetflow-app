// library imports
import { Router } from "express";

//local imports
import { healthController } from "./health.controllers";

// create router instance
const healthRouter = Router();

// GET /health
healthRouter.get("/", healthController);

healthRouter.get("/error", () => {
  throw new Error("Test error middleware");
});

export default healthRouter;

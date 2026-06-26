// src/rollers/health.controller.ts to GET/health check

// Library imports 
import type { Request, Response } from "express";
import { sendSuccess } from "../../shared/response";

// handles GET /health requests 
export const healthController = (
    req: Request,
    res: Response
) => {
    return sendSuccess(
        res,
        "Service is healthy"
    )
}
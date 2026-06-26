// global imports 
import { Response, Request } from "express";

// local imports 
import { sendError } from "../shared/response";

// Executes when no routes matches the request 
export const notFoundMiddleware = (
    req: Request,
    res: Response
) => {
    return sendError(
        res,
        "Route not found",
        [],
        404
    )
}
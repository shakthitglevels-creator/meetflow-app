
// global imports -  express provides a special type of error middleware 

// local import 
import { NextFunction } from "express";
import { sendError } from "../shared/response";


// Global Error handler Middleware
export const errorMiddleware = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log
}
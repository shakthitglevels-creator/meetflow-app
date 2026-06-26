// backend/src/shared/response.ts

// global import 
import { Response } from "express";

// standard successs response
export const sendSuccess = (
    res: Response,
    message: string,
    data: unknown = null,
    statusCode = 200
) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    })
}

// standard error response 
export const sendError = (
    res: Response,
    message: string,
    errors: unknown[] = [],
    statusCode = 500

) => {
    return res.status(statusCode).json({
        success: false,
        message,
        errors,
    })
}

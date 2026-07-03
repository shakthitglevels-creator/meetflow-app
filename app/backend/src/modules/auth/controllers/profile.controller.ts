import { Request, Response } from "express";
import { sendSuccess } from "../../../shared/response";

// This controller runs only authMiddleware verifies JWT
export const profileController = (req: Request, res: Response) => {
    // authMiddleware attached user data to req.user 
    const user = (req as any).user

    return sendSuccess(res, "Profile fetched successfully", user);
}
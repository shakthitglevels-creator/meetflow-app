import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";

// This middleware checks weather user is logged in or not
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Read authorization header from request
    const authHeader = req.headers.authorization;

    //if no authorization header user is not logged in
    if (!authHeader) {
      throw new Error("Authorization token is missing");
    }

    // Header format should be Bearer token
    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new Error("Invalid authorization format");
    }

    // Verify token using JWT secret
    const decoded = verifyAccessToken(token);

    // Store decoded user info inside request object
    // We will improve this TypeScript type later
    (req as any).user = decoded;

    // Token is valid, allow request to continue

    // Token is valid, allow request to continue
    next();
  } catch (error) {
    next(error)
  }
};


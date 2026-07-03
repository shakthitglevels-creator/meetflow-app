import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

// This middleware accepts any Zod schema
export const validate =
  (schema: z.ZodType) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body using the schema
      schema.parse(req.body);

      // If validation passes, go to controller
      next();
    } catch (error) {
      // If validation fails, Zod throws ZodError
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.issues,
        });
      }

      // Any other error goes to global error middleware
      next(error);
    }
  };
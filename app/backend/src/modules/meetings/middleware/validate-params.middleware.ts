import {
  Request,
  Response,
  NextFunction,
} from "express";
import { z, ZodError } from "zod";

import { AppError } from "../../../shared/errors/app-error";
// Validates URL parameters such as :meetingCode or :userId
export const validateParams =
  (schema: z.ZodType) =>
  (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Validate and transform the URL parameters
      const validatedParams = schema.parse(req.params);

      // Replace raw parameters with cleaned parameters
      req.params = validatedParams as Record<string, string>;

      // Validation passed, continue to controller
      next();
    } catch (error) {
      // Zod validation errors are safe client errors
      if (error instanceof ZodError) {
        return next(
          new AppError(
            "Validation failed",
            400
          )
        );
      }

      // Unknown errors go to the global error middleware
      next(error);
    }
  };
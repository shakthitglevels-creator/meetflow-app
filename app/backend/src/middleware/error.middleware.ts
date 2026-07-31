
// // global imports -  express provides a special type of error middleware 

// // local import 
// import { NextFunction, Request, Response } from "express";
// import { sendError } from "../shared/response";
// import { AppError } from "../shared/errors/app-error";


// // Global Error handler Middleware
// export const errorMiddleware = (
//     error: Error,
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     console.error(error);


//   // AppError contains a known HTTP status code
//   if (error instanceof AppError) {
//     return sendError(
//       res,
//       error.message,
//       [],
//       error.statusCode
//     );
//   }

//     return sendError(
//         res,
//         "Internal Server Error",
//         [],
//         500

//     )
// }



import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { AppError } from "../shared/errors/app-error";

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof AppError) {
    return res
      .status(error.statusCode)
      .json({
        success: false,
        message: error.message,
        ...(error.details ?? {}),
      });
  }

  console.error(
    "Unhandled application error:",
    error,
  );

  return res
    .status(500)
    .json({
      success: false,
      message:
        "An unexpected server error occurred",
    });
};
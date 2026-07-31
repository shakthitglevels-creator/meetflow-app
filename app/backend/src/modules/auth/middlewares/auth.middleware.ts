// import type { NextFunction, Request, Response } from "express";

// import { AppError } from "../../../shared/errors/app-error";
// import { findUserById } from "../../users/repositories/user.repository";

// import { verifyAccessToken } from "../utils/jwt";

// /*
//  * Protects REST API routes.
//  *
//  * It performs two levels of authentication:
//  *
//  * 1. Verifies the JWT signature and expiry.
//  * 2. Loads the latest user from MongoDB and checks
//  *    that the account is verified and active.
//  */
// export const authMiddleware = async (
//   req: Request,
//   _res: Response,
//   next: NextFunction,
// ): Promise<void> => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//       throw new AppError("Authorization token is missing", 401);
//     }

//     /*
//      * Expected format:
//      *
//      * Authorization: Bearer ACCESS_TOKEN
//      */
//     const [scheme, token] = authHeader.trim().split(/\s+/);

//     if (scheme !== "Bearer" || !token) {
//       throw new AppError("Invalid authorization format. Use Bearer token", 401);
//     }

//     /*
//      * verifyAccessToken should throw when:
//      *
//      * - token is expired
//      * - signature is invalid
//      * - token structure is invalid
//      */
//     const decoded = verifyAccessToken(token);

//     /*
//      * Load the current user from MongoDB.
//      *
//      * We do not trust only the JWT because the account
//      * may have been suspended or deleted after the token
//      * was originally generated.
//      */
//     const user = await findUserById(decoded.userId);

//     if (!user) {
//       throw new AppError("User account not found", 401);
//     }

//     /*
//      * Unverified users must not access protected routes.
//      */
//     if (!user.isEmailVerified) {
//       throw new AppError(
//         "Please verify your email before accessing this resource",
//         403,
//         {
//           code: "EMAIL_NOT_VERIFIED",
//           requiresVerification: true,
//         },
//       );
//     }

//     /*
//      * Suspended and pending users are blocked.
//      */
//     if (user.status !== "active") {
//       throw new AppError("Account is not active", 403, {
//         code: "ACCOUNT_NOT_ACTIVE",
//         status: user.status,
//       });
//     }

//     /*
//      * Store only trusted data loaded from MongoDB.
//      *
//      * Controllers and services can now access:
//      *
//      * req.user.userId
//      * req.user.role
//      */
//     req.user = {
//       userId: user._id.toString(),
//       role: user.role,
//     };

//     next();
//   } catch (error: unknown) {
//     /*
//      * Preserve known application errors.
//      *
//      * Examples:
//      * - account not active
//      * - email not verified
//      * - missing token
//      */
//     if (error instanceof AppError) {
//       next(error);
//       return;
//     }

//     /*
//      * JWT errors from jsonwebtoken are converted
//      * into a safe, consistent application error.
//      */
//     next(new AppError("Invalid or expired access token", 401));
//   }
// };








import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { UserRole } from "../../../users/user.model";

import { AppError } from "../../../shared/errors/app-error";
import { findUserById } from "../../users/repositories/user.repository";
import { verifyAccessToken } from "../utils/jwt";

/*
 * Authenticated user data attached to the request
 * after the access token and database account
 * have both been validated.
 */
export type AuthenticatedUser = {
  userId: string;
  role: UserRole;
};

/*
 * Extend the normal Express Request type for
 * authenticated routes.
 */
export interface AuthenticatedRequest
  extends Request {
  user?: AuthenticatedUser;
}

/*
 * Protects REST API routes.
 *
 * Validation sequence:
 *
 * 1. Read the Authorization header.
 * 2. Validate the Bearer token format.
 * 3. Verify the JWT signature and expiry.
 * 4. Load the latest user from MongoDB.
 * 5. Confirm the email is verified.
 * 6. Confirm the account status is active.
 * 7. Attach trusted user information to req.user.
 */
export const authMiddleware = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      throw new AppError(
        "Authorization token is missing",
        401,
      );
    }

    /*
     * Expected header:
     *
     * Authorization: Bearer ACCESS_TOKEN
     */
    const [scheme, token] =
      authHeader.trim().split(/\s+/);

    if (
      scheme !== "Bearer" ||
      !token
    ) {
      throw new AppError(
        "Invalid authorization format. Use Bearer token",
        401,
      );
    }

    /*
     * This throws when the token:
     *
     * - is expired;
     * - has an invalid signature;
     * - is malformed.
     */
    const decoded =
      verifyAccessToken(token);

    /*
     * Load the latest account state from MongoDB.
     *
     * We do not rely only on JWT data because the
     * account may have been suspended or deleted
     * after the token was issued.
     */
    const user =
      await findUserById(
        decoded.userId,
      );

    if (!user) {
      throw new AppError(
        "User account not found",
        401,
      );
    }

    /*
     * Block users who have not successfully
     * completed OTP verification.
     */
    if (!user.isEmailVerified) {
      throw new AppError(
        "Please verify your email before accessing this resource",
        403,
        {
          code: "EMAIL_NOT_VERIFIED",
          requiresVerification: true,
        },
      );
    }

    /*
     * Block pending and suspended users.
     */
    if (user.status !== "active") {
      throw new AppError(
        "Account is not active",
        403,
        {
          code: "ACCOUNT_NOT_ACTIVE",
          status: user.status,
        },
      );
    }

    /*
     * Attach trusted database values to the request.
     *
     * Protected controllers can use:
     *
     * req.user?.userId
     * req.user?.role
     */
    req.user = {
      userId:
        user._id.toString(),
      role: user.role,
    };

    next();
  } catch (error: unknown) {
    /*
     * Keep known application errors unchanged.
     */
    if (error instanceof AppError) {
      next(error);
      return;
    }

    /*
     * Convert JWT-library errors into a safe
     * application response.
     */
    next(
      new AppError(
        "Invalid or expired access token",
        401,
      ),
    );
  }
};
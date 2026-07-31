import type { ExtendedError, Socket } from "socket.io";

import { verifyAccessToken } from "../../modules/auth/utils/jwt";
import { findUserById } from "../../modules/users/repositories/user.repository";

/*
 * Authenticates a Socket.IO connection during
 * the initial handshake.
 *
 * The socket is allowed to connect only when:
 *
 * - access token is valid
 * - user exists
 * - email is verified
 * - account status is active
 */
export const socketAuthMiddleware = async (
  socket: Socket,
  next: (error?: ExtendedError) => void,
): Promise<void> => {
  try {
    const token = socket.handshake.auth?.token;

    if (typeof token !== "string" || !token.trim()) {
      next(new Error("Socket authentication token is missing"));

      return;
    }

    /*
     * Verify the same access token used by REST APIs.
     */
    const decoded = verifyAccessToken(token.trim());

    /*
     * Load the latest account status from MongoDB.
     */
    const user = await findUserById(decoded.userId);

    if (!user) {
      next(new Error("User account not found"));

      return;
    }

    if (!user.isEmailVerified) {
      next(new Error("Email verification is required"));

      return;
    }

    if (user.status !== "active") {
      next(new Error("Account is not active"));

      return;
    }

    /*
     * Store trusted user identity on the socket.
     *
     * Later socket event handlers can use:
     *
     * socket.data.user.userId
     * socket.data.user.role
     */
    socket.data.user = {
      userId: user._id.toString(),
      role: user.role,
    };

    next();
  } catch {
    next(new Error("Invalid or expired socket authentication token"));
  }
};

import { Socket } from "socket.io";
import { verifyAccessToken } from "../../modules/auth/utils/jwt";

export const socketAuthMiddleware = (socket: Socket, next: (error?: Error) => void) => {
    try {
        // read access token sent during the socket.io handshake
        const token = socket.handshake.auth.token

        if (typeof token !== "string" || !token.trim()) {
            return next (
                new Error("Socket authentication token is missing")
            )
        }
        
        // Verify the same access token used by the REST APIs
        const decoded = verifyAccessToken(token)

        // Store the authenticated identity on this socket connection
        socket.data.user = {
            userId: decoded.userId,
            role: decoded.role,
        }

        next()
    } catch (error) {
        return next (
            new Error ("Invalid or expired socket authentication token are")
        )
    }
}
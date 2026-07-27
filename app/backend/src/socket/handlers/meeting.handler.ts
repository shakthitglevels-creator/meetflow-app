


import { Server, Socket } from "socket.io";
import { SOCKET_EVENTS } from "../events/meeting.events";
import { joinMeetingRoomService } from "../../modules/meetings/services/meeting.service";

export const registerMeetingHandlers = (
  io: Server,
  socket: Socket
) => {
  // Join a Socket.IO meeting room
  socket.on(
     SOCKET_EVENTS.MEETING_JOIN_ROOM,
    async (meetingCode: string) => {
      try {
        const userId = socket.data.user.userId;

        const result = await joinMeetingRoomService(
          meetingCode,
          userId
        );

        await socket.join(meetingCode);

        // Confirm only to the joining browser
        socket.emit(  SOCKET_EVENTS.MEETING_JOINED_ROOM, {
          meetingCode,
          participantId: result.participantId,
          role: result.role,
        });

        // Notify everyone else in the room
        socket.to(meetingCode).emit(
          SOCKET_EVENTS.PRESENCE_JOINED,
          {
            meetingCode,
            userId,
            participantId: result.participantId,
            role: result.role,
          }
        );

        console.log(
          `[Socket] User ${userId} joined room ${meetingCode}`
        );
      } catch (error) {
        socket.emit(SOCKET_EVENTS.PRESENCE_JOINED, {
          success: false,
          event: "meeting:join-room",
          message:
            error instanceof Error
              ? error.message
              : "Unknown socket error",
        });
      }
    }
  );

  // Leave a Socket.IO meeting room
  socket.on(
    SOCKET_EVENTS.MEETING_JOIN_ROOM,
    async (meetingCode: string) => {
      try {
        const userId = socket.data.user.userId;

        /*
         * Notify remaining users before this socket leaves.
         * socket.to(...) excludes the current socket.
         */
        socket.to(meetingCode).emit(
          SOCKET_EVENTS.PRESENCE_JOINED,
          {
            meetingCode,
            userId,
          }
        );

        // Remove this connection from the in-memory room
        await socket.leave(meetingCode);

        // Confirm only to the leaving browser
        socket.emit( SOCKET_EVENTS.MEETING_JOINED_ROOM, {
          meetingCode,
        });

        console.log(
          `[Socket] User ${userId} left room ${meetingCode}`
        );
      } catch (error) {
        socket.emit( SOCKET_EVENTS.MEETING_JOINED_ROOM, {
          success: false,
          event: "meeting:leave-room",
          message:
            error instanceof Error
              ? error.message
              : "Unknown socket error",
        });
      }
    }
  );
};
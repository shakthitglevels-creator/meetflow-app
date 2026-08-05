export const SOCKET_EVENTS = {
  // Client -> Server
  MEETING_JOIN_ROOM: "meeting:join-room",
  MEETING_LEAVE_ROOM: "meeting:leave-room",

  // Server -> Client
  MEETING_JOINED_ROOM: "meeting:joined-room",
  MEETING_LEFT_ROOM: "meeting:left-room",

  PRESENCE_JOINED: "meeting:presence-joined",
  PRESENCE_LEFT: "meeting:presence-left",

  PARTICIPANTS_UPDATED: "meeting:participants-updated",

  WEBRTC_OFFER: "webrtc:offer",

  WEBRTC_ANSWER: "webrtc:answer",

  WEBRTC_ICE_CANDIDATE: "webrtc:ice-candidate",

  

  ERROR: "meeting:error",
} as const;

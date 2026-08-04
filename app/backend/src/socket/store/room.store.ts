type Participant = {
  userId: string;
  socketId: string;
  name?: string;
};

const rooms = new Map<
  string,
  Participant[]
>();

export const roomStore = {
  addParticipant(
    meetingCode: string,
    participant: Participant
  ) {
    const room =
      rooms.get(meetingCode) ?? [];

    const alreadyExists =
      room.some(
        (existingParticipant) =>
          existingParticipant.socketId ===
          participant.socketId
      );

    if (!alreadyExists) {
      room.push(participant);
    }

    rooms.set(
      meetingCode,
      room
    );

    return room;
  },

  removeParticipant(
    meetingCode: string,
    socketId: string
  ) {
    const room =
      rooms.get(meetingCode) ?? [];

    const updatedRoom =
      room.filter(
        (participant) =>
          participant.socketId !==
          socketId
      );

    rooms.set(
      meetingCode,
      updatedRoom
    );

    return updatedRoom;
  },

  getParticipants(
    meetingCode: string
  ) {
    return (
      rooms.get(meetingCode) ?? []
    );
  },
};
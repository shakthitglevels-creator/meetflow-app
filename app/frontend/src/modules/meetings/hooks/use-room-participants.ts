"use client";

import { useEffect, useState } from "react";
import {socket} from "@/lib/socket";

export type Participant = {
  userId: string;
  socketId: string;
};

export const useRoomParticipants = () => {
  const [participants, setParticipants] =
    useState<Participant[]>([]);

  useEffect(() => {
    const handleParticipantsUpdate = (
      participantsList: Participant[],
    ) => {
      setParticipants(participantsList);
    };

    socket.on(
      "meeting:participants-updated",
      handleParticipantsUpdate,
    );

    return () => {
      socket.off(
        "meeting:participants-updated",
        handleParticipantsUpdate,
      );
    };
  }, []);

  return {
    participants,
  };
};
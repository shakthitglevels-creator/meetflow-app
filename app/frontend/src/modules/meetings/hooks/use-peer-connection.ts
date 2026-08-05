"use client";

import { useEffect, useRef } from "react";
import { socket } from "@/lib/socket";


export const usePeerConnection = (stream: MediaStream | null,) => {
  const peerConnectionRef =
    useRef<RTCPeerConnection | null>(
      null,
    );

    const targetSocketIdRef =
  useRef<string | null>(
    null,
  );

  useEffect(() => {
    const peerConnection =
      new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
            ],
          },
        ],
      });

peerConnectionRef.current =
  peerConnection;

if (stream) {
  stream
    .getTracks()
    .forEach((track) => {
      peerConnection.addTrack(
        track,
        stream,
      );
    });

  console.log(
    "Local tracks added",
  );
}

console.log(
  "RTCPeerConnection created",
);

  peerConnection.onicecandidate =
  (event) => {
    if (!event.candidate) {
      return;
    }

    const targetSocketId =
      targetSocketIdRef.current;

    if (!targetSocketId) {
      return;
    }

    socket.emit(
      "webrtc:ice-candidate",
      {
        targetSocketId,
        candidate:
          event.candidate,
      },
    );

    console.log(
      "ICE candidate sent",
    );
  };

    peerConnection.ontrack =
      (event) => {
        console.log(
          "Remote track received",
          event.streams,
        );
      };

    /*
     * OFFER RECEIVED
     */
    socket.on(
      "webrtc:offer",
      async ({
        senderSocketId,
        offer,
      }: {
        senderSocketId: string;
        offer: RTCSessionDescriptionInit;
      }) => {
        console.log(
          "Offer received from:",
          senderSocketId,
        );

        const peerConnection =
          peerConnectionRef.current;

        if (!peerConnection) {
          return;
        }

        targetSocketIdRef.current =
  senderSocketId;

        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(
            offer,
          ),
        );

        console.log(
          "Remote description set",
        );

        const answer =
          await peerConnection.createAnswer();

        await peerConnection.setLocalDescription(
          answer,
        );

        socket.emit(
          "webrtc:answer",
          {
            targetSocketId:
              senderSocketId,
            answer,
          },
        );

        console.log(
          "Answer sent:",
          senderSocketId,
        );
      },
    );

    /*
     * ANSWER RECEIVED
     */
    socket.on(
      "webrtc:answer",
      async ({
        senderSocketId,
        answer,
      }: {
        senderSocketId: string;
        answer: RTCSessionDescriptionInit;
      }) => {
        console.log(
          "Answer received from:",
          senderSocketId,
        );

        const peerConnection =
          peerConnectionRef.current;

        if (!peerConnection) {
          return;
        }

        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(
            answer,
          ),
        );

        console.log(
          "Remote answer applied",
        );
      },
    );

    socket.on(
  "webrtc:ice-candidate",
  async ({
    senderSocketId,
    candidate,
  }) => {
    console.log(
      "ICE candidate received from:",
      senderSocketId,
    );

    const peerConnection =
      peerConnectionRef.current;

    if (!peerConnection) {
      return;
    }

    await peerConnection.addIceCandidate(
      new RTCIceCandidate(
        candidate,
      ),
    );

    console.log(
      "ICE candidate added",
    );
  },
);

    return () => {
      socket.off("webrtc:offer");
      socket.off("webrtc:answer");
      socket.off(
  "webrtc:ice-candidate",
);

      peerConnection.close();
    };
  }, []);

  const createOffer =
    async () => {
      const peerConnection =
        peerConnectionRef.current;

      if (!peerConnection) {
        return;
      }

      const offer =
        await peerConnection.createOffer();

      await peerConnection.setLocalDescription(
        offer,
      );

      const participants =
        (window as any)
          .participants ?? [];

      const targetParticipant =
        participants.find(
          (participant: any) =>
            participant.socketId !==
            socket.id,
        );

      if (!targetParticipant) {
        return;
      }

      targetSocketIdRef.current =
  targetParticipant.socketId;

      socket.emit(
        "webrtc:offer",
        {
          targetSocketId:
            targetParticipant.socketId,
          offer,
        },
      );

      console.log(
        "Offer sent to:",
        targetParticipant.socketId,
      );

      console.log(
        "SDP OFFER CREATED:",
      );

      console.log(offer);
    };

  return {
    peerConnection:
      peerConnectionRef.current,
    createOffer,
  };
};
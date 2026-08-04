"use client";

import {
  Copy,
  Mic,
  MicOff,
  PhoneOff,
  Users,
  Video,
  VideoOff,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSocketConnection } from "../hooks/use-socket-connection";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

import { useLocalMedia } from "../hooks/use-local-media";
import { LocalVideo } from "./local-video";

import { useEffect, useState } from "react";
import {socket} from "@/lib/socket";

import { useRoomParticipants } from "../hooks/use-room-participants";

type MeetingRoomPageProps = {
  meetingCode: string;
};

export function MeetingRoomPage({
  meetingCode,
}: MeetingRoomPageProps) {
  const router = useRouter()
  useSocketConnection();;

  const {
  participants,
} = useRoomParticipants();

  const {
    stream,
    loading,
    error,
  } = useLocalMedia();

  const [isMicrophoneEnabled, setIsMicrophoneEnabled] =
    useState(true);

  const [isCameraEnabled, setIsCameraEnabled] =
    useState(true);

  async function handleCopyMeetingCode() {
    await navigator.clipboard.writeText(
      meetingCode,
    );

    toast.success(
      "Meeting code copied.",
    );
  }

  function handleLeaveMeeting() {
    router.replace("/dashboard");
  }

useEffect(() => {
  const joinRoom = () => {
    console.log(
      "Joining room:",
      meetingCode,
    );

    socket.emit(
      "meeting:join-room",
      meetingCode,
    );
  };

  if (socket.connected) {
    joinRoom();
  } else {
    socket.once(
      "connect",
      joinRoom,
    );
  }

  return () => {
    socket.emit(
      "meeting:leave-room",
      meetingCode,
    );
  };
}, [meetingCode]);

useEffect(() => {
  socket.on(
    "meeting:joined-room",
    (data) => {
      console.log(
        "JOINED ROOM:",
        data,
      );
    },
  );

  socket.on(
    "meeting:participants-updated",
    (participants) => {
      console.log(
        "PARTICIPANTS:",
        participants,
      );
    },
  );

  return () => {
    socket.off(
      "meeting:joined-room",
    );

    socket.off(
      "meeting:participants-updated",
    );
  };
}, []);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-7xl flex-col gap-5">
      <header className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">
            Live meeting
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Meeting room
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Meeting code:{" "}
            <span className="font-mono font-semibold text-foreground">
              {meetingCode}
            </span>
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleCopyMeetingCode}
        >
          <Copy className="size-4" />
          Copy code
        </Button>
      </header>

      <div className="grid flex-1 gap-5 xl:grid-cols-[1fr_20rem]">
        <Card className="min-h-[34rem] overflow-hidden">
          <CardContent className="flex h-full min-h-[34rem] items-center justify-center p-4">
            <div className="relative flex h-full min-h-[31rem] w-full items-center justify-center overflow-hidden rounded-2xl bg-zinc-950">

              {loading ? (
                <div className="flex flex-col items-center gap-4 text-center text-white">
                  <Spinner />

                  <p className="font-medium">
                    Starting camera...
                  </p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center gap-4 text-center text-white">
                  <span className="flex size-20 items-center justify-center rounded-full bg-red-500/10">
                    <VideoOff className="size-9 text-red-500" />
                  </span>

                  <div>
                    <p className="font-medium text-red-500">
                      Camera unavailable
                    </p>

                    <p className="mt-1 text-sm text-white/60">
                      {error}
                    </p>
                  </div>
                </div>
              ) : stream &&
                isCameraEnabled ? (
                <LocalVideo
                  stream={stream}
                />
              ) : (
                <div className="flex flex-col items-center gap-4 text-center text-white">
                  <span className="flex size-20 items-center justify-center rounded-full bg-white/10">
                    <VideoOff className="size-9" />
                  </span>

                  <p className="font-medium">
                    Camera is turned off
                  </p>
                </div>
              )}

              <div className="absolute bottom-4 left-4 rounded-lg bg-black/60 px-3 py-2 text-sm font-medium text-white backdrop-blur">
                You
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="size-5" />
              Participants
            </CardTitle>

            <CardDescription>
              Connected participants will appear here.
            </CardDescription>
          </CardHeader>

        <CardContent>
  <div className="space-y-3">
    {participants.length === 0 ? (
      <div className="rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center">
        <p className="text-sm font-medium">
          No participants connected
        </p>
      </div>
    ) : (
      participants.map((participant) => (
        <div
          key={participant.socketId}
          className="rounded-lg border p-3"
        >
          <p className="text-sm font-medium">
            {participant.userId}
          </p>

          <p className="text-xs text-muted-foreground">
            {participant.socketId}
          </p>
        </div>
      ))
    )}
  </div>
</CardContent>
        </Card>
      </div>

      <footer className="sticky bottom-4 mx-auto flex items-center gap-3 rounded-2xl border border-border/80 bg-card/90 p-3 shadow-lg backdrop-blur-xl">
        <Button
          type="button"
          variant={
            isMicrophoneEnabled
              ? "secondary"
              : "destructive"
          }
          size="icon"
          className="size-12 rounded-full"
          onClick={() => {
            const enabled =
              !isMicrophoneEnabled;

            stream
              ?.getAudioTracks()
              .forEach((track) => {
                track.enabled =
                  enabled;
              });

            setIsMicrophoneEnabled(
              enabled,
            );
          }}
        >
          {isMicrophoneEnabled ? (
            <Mic className="size-5" />
          ) : (
            <MicOff className="size-5" />
          )}
        </Button>

        <Button
          type="button"
          variant={
            isCameraEnabled
              ? "secondary"
              : "destructive"
          }
          size="icon"
          className="size-12 rounded-full"
          onClick={() => {
            const enabled =
              !isCameraEnabled;

            stream
              ?.getVideoTracks()
              .forEach((track) => {
                track.enabled =
                  enabled;
              });

            setIsCameraEnabled(
              enabled,
            );
          }}
        >
          {isCameraEnabled ? (
            <Video className="size-5" />
          ) : (
            <VideoOff className="size-5" />
          )}
        </Button>

        <Button
          type="button"
          variant="destructive"
          className="h-12 rounded-full px-6"
          onClick={handleLeaveMeeting}
        >
          <PhoneOff className="size-5" />
          Leave
        </Button>
      </footer>
    </div>
  );
}
"use client";

import {
  Calendar,
  Clock3,
  Copy,
  ShieldCheck,
  Users,
  Video,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

import { useJoinMeeting } from "../hooks/use-join-meeting";
import { useMeetingDetails } from "../hooks/use-meeting-details";

type MeetingPreviewPageProps = {
  meetingCode: string;
};

export function MeetingPreviewPage({
  meetingCode,
}: MeetingPreviewPageProps) {
  const meetingQuery =
    useMeetingDetails(meetingCode);

  const joinMeetingMutation =
    useJoinMeeting();

  async function copyMeetingCode() {
    await navigator.clipboard.writeText(
      meetingCode,
    );

    toast.success(
      "Meeting code copied.",
    );
  }

  if (meetingQuery.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner />
          Loading meeting...
        </div>
      </div>
    );
  }

  if (
    meetingQuery.isError ||
    !meetingQuery.data
  ) {
    return (
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle>
            Meeting unavailable
          </CardTitle>

          <CardDescription>
            We could not load this meeting. Check the
            meeting code and try again.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const meeting =
    meetingQuery.data.data;

  return (
    <div className="mx-auto max-w-3xl py-6">
      <Card>
        <CardHeader className="text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Video className="size-7" />
          </span>

          <CardTitle className="mt-4 text-2xl">
            {meeting.title}
          </CardTitle>

          <CardDescription>
            Review the meeting details before joining.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border bg-muted/30 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Meeting code
              </p>

              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="font-mono text-lg font-semibold">
                  {meeting.meetingCode}
                </p>

                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={copyMeetingCode}
                >
                  <Copy className="size-4" />
                </Button>
              </div>
            </div>

            <div className="rounded-xl border bg-muted/30 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Host
              </p>

              <p className="mt-2 font-medium">
                {meeting.host.name}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {meeting.host.email}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl border p-4">
              <Users className="size-4 text-muted-foreground" />

              <div>
                <p className="text-sm font-medium">
                  {meeting.participantCount}
                </p>

                <p className="text-xs text-muted-foreground">
                  Participants
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border p-4">
              <Calendar className="size-4 text-muted-foreground" />

              <div>
                <p className="text-sm font-medium capitalize">
                  {meeting.status}
                </p>

                <p className="text-xs text-muted-foreground">
                  Status
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border p-4">
              <Clock3 className="size-4 text-muted-foreground" />

              <div>
                <p className="text-sm font-medium">
                  {meeting.startedAt
                    ? new Date(
                        meeting.startedAt,
                      ).toLocaleTimeString()
                    : "Not started"}
                </p>

                <p className="text-xs text-muted-foreground">
                  Started
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-primary/15 bg-primary/5 p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 size-5 text-primary" />

              <div>
                <p className="text-sm font-medium">
                  Secure meeting
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Only authenticated and active MeetFlow
                  users can join this room.
                </p>
              </div>
            </div>
          </div>

          <Button
            type="button"
            size="lg"
            className="w-full"
            disabled={
              joinMeetingMutation.isPending ||
              meeting.status !== "open"
            }
            onClick={() =>
              joinMeetingMutation.mutate(
                meeting.meetingCode,
              )
            }
          >
            {joinMeetingMutation.isPending ? (
              <>
                <Spinner />
                Joining meeting...
              </>
            ) : meeting.status === "open" ? (
              <>
                <Video className="size-4" />
                Join meeting
              </>
            ) : (
              "Meeting is not open"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
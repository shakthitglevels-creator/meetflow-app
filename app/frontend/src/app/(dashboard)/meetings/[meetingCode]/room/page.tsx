import type { Metadata } from "next";

import {MeetingRoomPage} from "@/modules/meetings/components/meeting-room-page";

export const metadata: Metadata = {
  title: "Meeting Room | MeetFlow",
  description:
    "Join your MeetFlow video meeting.",
};

type MeetingRoomRouteProps = {
  params: Promise<{
    meetingCode: string;
  }>;
};

export default async function MeetingRoomRoute({
  params,
}: MeetingRoomRouteProps) {
  const { meetingCode } = await params;

  return (
    <MeetingRoomPage
      meetingCode={meetingCode.toUpperCase()}
    />
  );
}
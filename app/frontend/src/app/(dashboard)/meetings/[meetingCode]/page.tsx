import type { Metadata } from "next";

import { MeetingPreviewPage } from "@/modules/meetings/components/meeting-preview-page";

export const metadata: Metadata = {
  title: "Meeting Preview | MeetFlow",
  description:
    "Review your MeetFlow meeting before joining.",
};

type MeetingPreviewRouteProps = {
  params: Promise<{
    meetingCode: string;
  }>;
};

export default async function MeetingPreviewRoute({
  params,
}: MeetingPreviewRouteProps) {
  const { meetingCode } = await params;

  return (
    <MeetingPreviewPage
      meetingCode={meetingCode.toUpperCase()}
    />
  );
}
import type { Metadata } from "next";

import { DashboardHeader } from "@/modules/dashboard/components/dashboard-header";
import { DashboardOverview } from "@/modules/dashboard/components/dashboard-overview";

export const metadata: Metadata = {
  title: "Dashboard | MeetFlow",
  description: "Manage your MeetFlow meetings.",
};

export default function DashboardPage() {
  return (
    <>
      {/* <DashboardHeader /> */}
      <DashboardOverview />
    </>
  );
}
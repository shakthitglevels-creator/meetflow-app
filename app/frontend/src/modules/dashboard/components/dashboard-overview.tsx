"use client";

import {
  ArrowRight,
  Calendar,
  Clock3,
  Plus,
  Users,
  Video,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { DashboardMeetingActions } from "@/modules/meetings/components/dashboard-meeting-actions";
const statistics = [
  {
    label: "Total meetings",
    value: "0",
    icon: Video,
    iconClassName:
      "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  },
  {
    label: "Upcoming",
    value: "0",
    icon: Calendar,
    iconClassName:
      "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
  },
  {
    label: "Participants",
    value: "0",
    icon: Users,
    iconClassName:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
  {
    label: "Meeting hours",
    value: "0h",
    icon: Clock3,
    iconClassName:
      "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  },
];
export function DashboardOverview() {
  const user = useAuthStore(
    (state) => state.user
  );

  const firstName =
    user?.name?.trim().split(" ")[0] ?? "there";

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">
            Your workspace
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Welcome back, {firstName}
          </h1>

          <p className="mt-3 max-w-2xl text-muted-foreground">
            Start a meeting, join with a meeting code or
            manage your upcoming conversations.
          </p>
        </div>

        <Button
          type="button"
          size="lg"
          className="w-full gap-2 sm:w-fit"
        >
          <Plus className="size-4" />
          Create meeting
        </Button>
      </section>

      <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.map((statistic) => {
          const Icon = statistic.icon;

          return (
            <Card key={statistic.label}>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {statistic.label}
                  </p>

                  <p className="mt-2 text-2xl font-semibold">
                    {statistic.value}
                  </p>
                </div>

                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Start or join a meeting</CardTitle>

            <CardDescription>
              Create a new room instantly or enter an
              existing meeting code.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
          
            <DashboardMeetingActions />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming meetings</CardTitle>

            <CardDescription>
              Your scheduled meetings will appear here.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex min-h-44 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-6 text-center">
              <span className="flex size-11 items-center justify-center rounded-xl bg-background shadow-sm">
                <Calendar className="size-5 text-muted-foreground" />
              </span>

              <p className="mt-4 text-sm font-medium">
                No upcoming meetings
              </p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Schedule a meeting and it will appear here.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
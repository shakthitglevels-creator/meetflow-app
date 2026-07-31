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

const statistics = [
  {
    label: "Total meetings",
    value: "0",
    icon: Video,
  },
  {
    label: "Upcoming",
    value: "0",
    icon: Calendar,
  },
  {
    label: "Participants",
    value: "0",
    icon: Users,
  },
  {
    label: "Meeting hours",
    value: "0h",
    icon: Clock3,
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

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            <Button
              type="button"
              className="h-12 w-full justify-between px-5"
            >
              <span className="flex items-center gap-3">
                <Video className="size-5" />
                Start an instant meeting
              </span>

              <ArrowRight className="size-4" />
            </Button>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                placeholder="Enter meeting code"
                className="h-11"
              />

              <Button
                type="button"
                variant="outline"
                className="h-11 sm:px-6"
              >
                Join meeting
              </Button>
            </div>
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
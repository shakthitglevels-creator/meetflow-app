import Link from "next/link";
import {
  ArrowRight,
  CalendarPlus,
  CheckCircle2,
  Play,
  ShieldCheck,
  Sparkles,
  Video,
} from "lucide-react";

const benefits = [
  "No downloads required",
  "Secure meetings",
  "Real-time collaboration",
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.16),transparent_34%),radial-gradient(circle_at_85%_25%,hsl(var(--primary)/0.10),transparent_28%)]"
        aria-hidden="true"
      />

      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1.5 text-sm font-medium shadow-sm">
            <Sparkles className="size-4 text-primary" />

            <span>Professional meetings made simple</span>
          </div>

          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Meet, collaborate and move work
            <span className="text-primary"> forward.</span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-lg leading-8 text-muted-foreground">
            MeetFlow brings secure video meetings, real-time presence,
            collaboration and effortless communication into one modern
            workspace.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl"
            >
              Start meeting free
              <ArrowRight className="size-4" />
            </Link>

            <Link
              href="#how-it-works"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 text-sm font-semibold shadow-sm transition-colors hover:bg-muted"
            >
              <Play className="size-4" />
              See how it works
            </Link>
          </div>

          <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
            {benefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <CheckCircle2 className="size-4 text-primary" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div
            className="absolute -inset-6 -z-10 rounded-[2rem] bg-primary/10 blur-3xl"
            aria-hidden="true"
          />

          <div className="overflow-hidden rounded-[2rem] border border-border/80 bg-card shadow-2xl shadow-black/10">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <p className="text-sm font-semibold">
                  Product team stand-up
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  12 participants · 24:08
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400">
                <span className="size-2 rounded-full bg-green-500" />
                Live
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-muted/40 p-4">
              {["You", "Aarav", "Maya", "Daniel"].map(
                (participant, index) => (
                  <div
                    key={participant}
                    className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-border bg-background"
                  >
                    <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                      {participant.charAt(0)}
                    </div>

                    <div className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white">
                      {participant}
                    </div>

                    {index === 1 && (
                      <div className="absolute inset-0 rounded-2xl ring-2 ring-inset ring-primary" />
                    )}
                  </div>
                )
              )}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-4">
              <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
                <ShieldCheck className="size-4 text-green-500" />
                Secure connection
              </div>

              <div className="mx-auto flex items-center gap-2 sm:mx-0">
                <button
                  type="button"
                  aria-label="Toggle microphone"
                  className="flex size-10 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-muted"
                >
                  <Video className="size-4" />
                </button>

                <button
                  type="button"
                  aria-label="Schedule a meeting"
                  className="flex size-10 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-muted"
                >
                  <CalendarPlus className="size-4" />
                </button>

                <button
                  type="button"
                  className="h-10 rounded-full bg-destructive px-5 text-sm font-semibold text-destructive-foreground transition-opacity hover:opacity-90"
                >
                  Leave
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
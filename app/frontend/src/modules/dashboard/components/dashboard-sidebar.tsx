import Link from "next/link";
import {
  ShieldCheck,
  Video,
} from "lucide-react";

import { SidebarNavigation } from "./sidebar-navigation";

export function DashboardSidebar() {
  return (
    <aside className="hidden min-h-screen w-60 shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex lg:flex-col">
      <div className="flex h-16 items-center border-b border-sidebar-border px-5">
        <Link
          href="/dashboard"
          className="flex items-center gap-2"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Video className="size-5" />
          </span>

          <span className="text-lg font-semibold tracking-tight">
            MeetFlow
          </span>
        </Link>
      </div>

      <div className="flex-1 px-3 py-5">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Workspace
        </p>

        <SidebarNavigation />
      </div>

      <div className="border-t border-border p-4">
        <div className="rounded-xl bg-muted/50 p-4">
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background">
              <ShieldCheck className="size-4 text-primary" />
            </span>

            <div>
              <p className="text-sm font-medium">
                Secure meetings
              </p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Your workspace is protected with authenticated sessions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
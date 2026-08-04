"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  Video,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { SidebarNavigation } from "./sidebar-navigation";

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
    >
       <SheetTrigger
    render={
      <Button
        variant="ghost"
        size="icon"
        aria-label="Open navigation"
      />
    }
  >
    <Menu />
  </SheetTrigger>

      <SheetContent
        side="left"
        className="w-72 p-0"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>
            MeetFlow navigation
          </SheetTitle>

          <SheetDescription>
            Navigate through your MeetFlow workspace.
          </SheetDescription>
        </SheetHeader>

        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b border-border px-5">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2"
            >
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Video className="size-5" />
              </span>

              <span className="text-lg font-semibold">
                MeetFlow
              </span>
            </Link>
          </div>

          <div className="flex-1 px-3 py-5">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Workspace
            </p>

            <SidebarNavigation
              onNavigate={() =>
                setOpen(false)
              }
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
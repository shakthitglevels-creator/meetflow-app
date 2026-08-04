"use client";

import {
  Bell,
  LogOut,
  Moon,
  Settings,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useLogout } from "@/modules/auth/hooks/use-logout";
import { useAuthStore } from "@/modules/auth/store/auth.store";

import { MobileSidebar } from "./mobile-sidebar";

export function DashboardHeader() {
  const { resolvedTheme, setTheme } =
    useTheme();

  const logoutMutation = useLogout();

  const user = useAuthStore(
    (state) => state.user,
  );

  const userInitial =
    user?.name
      ?.trim()
      .charAt(0)
      .toUpperCase() ??
    user?.email
      ?.trim()
      .charAt(0)
      .toUpperCase() ??
    "U";

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center border-b border-border/80 bg-card/80 px-4 backdrop-blur-xl supports-[backdrop-filter]:bg-card/70 sm:px-6">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-3">
          <MobileSidebar />

          <div>
            <p className="text-sm font-semibold">
              Workspace
            </p>

            <p className="hidden text-xs text-muted-foreground sm:block">
              Manage meetings and conversations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => {
              setTheme(
                resolvedTheme === "dark"
                  ? "light"
                  : "dark",
              );
            }}
          >
            {resolvedTheme === "dark" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Notifications"
          >
            <Bell className="size-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Settings"
          >
            <Settings className="size-4" />
          </Button>

          <div className="mx-2 hidden h-7 w-px bg-border sm:block" />

          <div className="hidden items-center gap-3 sm:flex">
            <div className="text-right">
              <p className="max-w-36 truncate text-sm font-medium">
                {user?.name ??
                  "MeetFlow User"}
              </p>

              <p className="max-w-40 truncate text-xs text-muted-foreground">
                {user?.email}
              </p>
            </div>

            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="size-9 rounded-full object-cover"
              />
            ) : (
              <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {userInitial}
              </div>
            )}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Sign out"
            disabled={
              logoutMutation.isPending
            }
            onClick={() =>
              logoutMutation.mutate()
            }
          >
            {logoutMutation.isPending ? (
              <Spinner />
            ) : (
              <LogOut className="size-4" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
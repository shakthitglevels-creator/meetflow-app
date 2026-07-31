"use client";

import Link from "next/link";
import {
  Bell,
  LogOut,
  Moon,
  Settings,
  Sun,
  User,
  Video,
} from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useLogout } from "@/modules/auth/hooks/use-logout";
import { useAuthStore } from "@/modules/auth/store/auth.store";

export function DashboardHeader() {
  const { resolvedTheme, setTheme } = useTheme();

  const logoutMutation = useLogout();

  const user = useAuthStore(
    (state) => state.user
  );

  const userInitial =
    user?.name?.trim().charAt(0).toUpperCase() ??
    user?.email?.trim().charAt(0).toUpperCase() ??
    "U";

  function handleLogout() {
    if (logoutMutation.isPending) {
      return;
    }

    logoutMutation.mutate();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/dashboard"
          className="flex items-center gap-2"
          aria-label="MeetFlow dashboard"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Video className="size-5" />
          </span>

          <span className="text-lg font-semibold tracking-tight">
            MeetFlow
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => {
              setTheme(
                resolvedTheme === "dark"
                  ? "light"
                  : "dark"
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

          <div className="ml-1 hidden items-center gap-3 border-l border-border pl-4 sm:flex">
            <div className="text-right">
              <p className="max-w-40 truncate text-sm font-medium">
                {user?.name ?? "MeetFlow User"}
              </p>

              <p className="max-w-40 truncate text-xs text-muted-foreground">
                {user?.email ?? ""}
              </p>
            </div>

            <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {userInitial}
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Open profile"
            className="sm:hidden"
          >
            <User className="size-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Open settings"
          >
            <Settings className="size-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={
              logoutMutation.isPending
                ? "Signing out"
                : "Sign out"
            }
            title="Sign out"
            disabled={logoutMutation.isPending}
            onClick={handleLogout}
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
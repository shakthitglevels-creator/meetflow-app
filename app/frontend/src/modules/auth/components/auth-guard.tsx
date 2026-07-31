"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Video } from "lucide-react";

import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "../store/auth.store";

type AuthGuardProps = {
  children: ReactNode;
};

export function AuthGuard({
  children,
}: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const isHydrated = useAuthStore(
    (state) => state.isHydrated
  );

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!isAuthenticated) {
      const redirectUrl = encodeURIComponent(pathname);

      router.replace(
        `/login?redirect=${redirectUrl}`
      );
    }
  }, [
    isAuthenticated,
    isHydrated,
    pathname,
    router,
  ]);

  if (!isHydrated) {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    return <AuthLoadingScreen />;
  }

  return <>{children}</>;
}

function AuthLoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
          <Video className="size-6" />
        </span>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner />
          Loading your workspace...
        </div>
      </div>
    </div>
  );
}
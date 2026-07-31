import type { Metadata } from "next";
import { Suspense } from "react";

import { Spinner } from "@/components/ui/spinner";
import { ResetPasswordPage } from "@/modules/auth/components/reset-password-page";

export const metadata: Metadata = {
  title: "Reset Password | MeetFlow",
  description:
    "Reset your MeetFlow account password.",
};

export default function ResetPasswordRoute() {
  return (
    <Suspense
      fallback={<ResetPasswordLoading />}
    >
      <ResetPasswordPage />
    </Suspense>
  );
}

function ResetPasswordLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Spinner />
        Loading password reset...
      </div>
    </div>
  );
}
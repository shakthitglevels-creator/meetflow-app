import type { Metadata } from "next";
import { Suspense } from "react";

import { Spinner } from "@/components/ui/spinner";
import { VerifyOtpPage } from "@/modules/auth/components/verify-otp-page";

export const metadata: Metadata = {
  title: "Verify Account | MeetFlow",
  description:
    "Verify your MeetFlow account using the OTP sent to your email.",
};

export default function VerifyOtpRoute() {
  return (
    <Suspense fallback={<VerifyOtpLoading />}>
      <VerifyOtpPage />
    </Suspense>
  );
}

function VerifyOtpLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Spinner />
        Loading verification page...
      </div>
    </div>
  );
}
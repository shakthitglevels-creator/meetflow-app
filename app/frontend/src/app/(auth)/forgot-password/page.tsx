import type { Metadata } from "next";

import { ForgotPasswordPage } from "@/modules/auth/components/forgot-password-page";

export const metadata: Metadata = {
  title: "Forgot Password | MeetFlow",
  description:
    "Request a password-reset code for your MeetFlow account.",
};

export default function ForgotPasswordRoute() {
  return <ForgotPasswordPage />;
}
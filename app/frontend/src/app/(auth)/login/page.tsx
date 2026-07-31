import type { Metadata } from "next";

import { LoginPage } from "@/modules/auth/components/login-page";

export const metadata: Metadata = {
  title: "Sign In | MeetFlow",
  description: "Sign in to your MeetFlow account.",
};

export default function LoginRoute() {
  return <LoginPage />;
}
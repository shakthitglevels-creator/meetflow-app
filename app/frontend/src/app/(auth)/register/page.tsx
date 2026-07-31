import type { Metadata } from "next";

import { RegisterPage } from "@/modules/auth/components/register-page";

export const metadata: Metadata = {
  title: "Create Account | MeetFlow",
  description:
    "Create your MeetFlow account.",
};

export default function RegisterRoute() {
  return <RegisterPage />;
}
"use client";

import type { ReactNode } from "react";
import {
  GoogleOAuthProvider,
} from "@react-oauth/google";

import { env } from "@/config/env";

type GoogleAuthProviderProps = {
  children: ReactNode;
};

export function GoogleAuthProvider({
  children,
}: GoogleAuthProviderProps) {
  return (
    <GoogleOAuthProvider
      clientId={
        env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
      }
    >
      {children}
    </GoogleOAuthProvider>
  );
}
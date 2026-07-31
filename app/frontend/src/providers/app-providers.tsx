"use client";

import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";
import { ToastProvider } from "./toast-provider";

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({
  children,
}: AppProvidersProps) {
  return (
        <ThemeProvider>
      <QueryProvider>
        {children}

        <ToastProvider />
      </QueryProvider>
    </ThemeProvider>
  );
}
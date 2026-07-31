import type { ReactNode } from "react";

import { AuthGuard } from "@/modules/auth/components/auth-guard";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-muted/30">
        {children}
      </div>
    </AuthGuard>
  );
}
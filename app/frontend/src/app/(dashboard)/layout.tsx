import type { ReactNode } from "react";

import { AuthGuard } from "@/modules/auth/components/auth-guard";
import { DashboardShell } from "@/modules/dashboard/components/dashboard-shell";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <AuthGuard>
      <DashboardShell>
      <div className="min-h-screen bg-muted/30">
        {children}
      </div>
      </DashboardShell>
    </AuthGuard>
  );
}
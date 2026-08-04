"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { dashboardNavigation } from "../constants/dashboard-navigation";

type SidebarNavigationProps = {
  onNavigate?: () => void;
};

export function SidebarNavigation({
  onNavigate,
}: SidebarNavigationProps) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {dashboardNavigation.map((item) => {
        const Icon = item.icon;

        const isActive =
          item.href === "/dashboard"
            ? pathname === item.href
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
  isActive
    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
    : "text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
)}
          >
            <Icon className="size-4.5" />

            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
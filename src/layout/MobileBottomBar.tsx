"use client";

import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";
import { Home, Megaphone, Menu, MessageCircle, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, SVGProps } from "react";

type UserRole = "SUPER_ADMIN" | "BRANCH_ADMIN" | "TEACHER" | "STUDENT" | "PARENT";

type BottomBarLink = {
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const dashboardByRole: Record<UserRole, string> = {
  SUPER_ADMIN: "/dashboard/super-admin",
  BRANCH_ADMIN: "/dashboard/branch-admin",
  TEACHER: "/dashboard/teacher",
  STUDENT: "/dashboard/student",
  PARENT: "/dashboard/parent",
};

export default function MobileBottomBar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { isMobileOpen, toggleMobileSidebar } = useSidebar();

  const dashboardHref = user?.role ? dashboardByRole[user.role] : "/dashboard";

  const links: BottomBarLink[] = [
    { label: "Home", href: dashboardHref, icon: Home },
    { label: "Messages", href: "/dashboard/messages", icon: MessageCircle },
    { label: "Alerts", href: "/dashboard/announcements", icon: Megaphone },
    { label: "Profile", href: "/dashboard/profile", icon: UserRound },
  ];

  const isActive = (href: string) => {
    if (href === dashboardHref) return pathname === href || pathname === "/dashboard";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-2 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/95 lg:hidden"
      aria-label="Mobile app navigation"
    >
      <div className="mx-auto grid max-w-md grid-cols-5 items-end gap-1">
        {links.slice(0, 2).map((item) => (
          <BottomBarItem key={item.href} item={item} active={isActive(item.href)} />
        ))}

        <button
          type="button"
          onClick={toggleMobileSidebar}
          className={`mx-auto flex min-h-[58px] w-full flex-col items-center justify-end gap-1 rounded-2xl px-2 pb-1 text-xs font-medium transition ${
            isMobileOpen
              ? "text-brand-600 dark:text-brand-400"
              : "text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400"
          }`}
          aria-label={isMobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileOpen}
        >
          <span
            className={`flex h-13 w-13 items-center justify-center rounded-2xl shadow-lg transition ${
              isMobileOpen
                ? "bg-brand-600 text-white shadow-brand-500/30"
                : "bg-brand-500 text-white shadow-brand-500/25"
            }`}
          >
            <Menu className="h-6 w-6" />
          </span>
          <span>Menu</span>
        </button>

        {links.slice(2).map((item) => (
          <BottomBarItem key={item.href} item={item} active={isActive(item.href)} />
        ))}
      </div>
    </nav>
  );
}

function BottomBarItem({ item, active }: { item: BottomBarLink; active: boolean }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`flex min-h-[58px] flex-col items-center justify-end gap-1 rounded-2xl px-2 pb-1 text-xs font-medium transition ${
        active
          ? "text-brand-600 dark:text-brand-400"
          : "text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400"
      }`}
    >
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-2xl transition ${
          active ? "bg-brand-50 dark:bg-brand-500/15" : "bg-transparent"
        }`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span>{item.label}</span>
    </Link>
  );
}

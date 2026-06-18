"use client";

import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/super-admin": "Dashboard",
  "/dashboard/branch-admin": "Dashboard",
  "/dashboard/teacher": "Dashboard",
  "/dashboard/student": "Dashboard",
  "/dashboard/parent": "Dashboard",
  "/dashboard/messages": "Messages",
  "/dashboard/announcements": "Announcements",
  "/dashboard/calendar": "Calendar",
  "/dashboard/profile": "Profile",
  "/dashboard/super-admin/branches": "Branches",
  "/dashboard/super-admin/finance/overview": "Finance Overview",
  "/dashboard/super-admin/users/admins": "Admins",
  "/dashboard/super-admin/users/principals": "Principals",
  "/dashboard/super-admin/users/parents": "Parents",
  "/dashboard/super-admin/users/students": "Students",
  "/dashboard/super-admin/users/teachers": "Teachers",
  "/dashboard/branch-admin/students": "Students",
  "/dashboard/branch-admin/students/admissions": "Admissions",
  "/dashboard/branch-admin/students/attendance": "Attendance",
  "/dashboard/branch-admin/teachers": "Teachers",
  "/dashboard/branch-admin/teachers/schedule": "Teacher Schedule",
  "/dashboard/branch-admin/academics/classes": "Classes",
  "/dashboard/branch-admin/academics/subjects": "Subjects",
  "/dashboard/branch-admin/academics/timetable": "Timetable",
  "/dashboard/fees": "Fees",
  "/dashboard/teacher/classes": "My Classes",
  "/dashboard/teacher/attendance": "Attendance",
  "/dashboard/teacher/assignments": "Assignments",
  "/dashboard/teacher/marks": "Exams & Marks",
  "/dashboard/student/subjects": "My Subjects",
  "/dashboard/student/timetable": "Timetable",
  "/dashboard/student/assignments": "Assignments",
  "/dashboard/student/results": "Results",
  "/dashboard/student/fees": "Fees",
  "/dashboard/parent/children": "Children",
  "/dashboard/parent/attendance": "Attendance",
  "/dashboard/parent/performance": "Performance",
  "/dashboard/parent/fees": "Fees",
};

const topLevelMobilePages = new Set([
  "/dashboard",
  "/dashboard/super-admin",
  "/dashboard/branch-admin",
  "/dashboard/teacher",
  "/dashboard/student",
  "/dashboard/parent",
  "/dashboard/messages",
  "/dashboard/announcements",
  "/dashboard/profile",
]);

function titleFromPath(pathname: string) {
  if (pageTitles[pathname]) return pageTitles[pathname];

  const lastSegment = pathname.split("/").filter(Boolean).at(-1) || "Dashboard";
  return lastSegment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function initialsFromName(name?: string) {
  if (!name) return "U";

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export default function MobileDashboardHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const title = titleFromPath(pathname);
  const showBackButton = !topLevelMobilePages.has(pathname);

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 pt-[env(safe-area-inset-top)] shadow-sm backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/95 lg:hidden">
      <div className="flex min-h-16 items-center justify-between gap-3 px-4">
        <div className="flex min-w-0 items-center gap-2">
          {showBackButton && (
            <button
              type="button"
              onClick={() => router.back()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div className="min-w-0">
            <p className="truncate text-lg font-bold text-gray-900 dark:text-white">{title}</p>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">AMS LMS</p>
          </div>
        </div>

        <Link
          href="/dashboard/profile"
          className="flex min-w-0 shrink-0 items-center gap-2 rounded-lg px-1 py-1 transition hover:bg-gray-50 dark:hover:bg-gray-800"
          aria-label="Open profile"
        >
          <div className="hidden min-w-0 max-w-[6.5rem] text-right min-[380px]:block">
            <p className="truncate text-sm font-semibold leading-4 text-gray-900 dark:text-white">{user?.name || "Guest"}</p>
            <p className="truncate text-[10px] font-medium uppercase leading-3 tracking-wide text-gray-400 dark:text-gray-500">
              {user?.role?.replaceAll("_", " ") || "User"}
            </p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white shadow-sm">
            {user?.name ? initialsFromName(user.name) : <UserRound className="h-5 w-5" />}
          </div>
        </Link>
      </div>
    </header>
  );
}

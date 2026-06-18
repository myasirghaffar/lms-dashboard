"use client";

import Link from "next/link";
import React from "react";
import { Bell, BellRing, CheckCheck, Megaphone, ReceiptText, ShieldAlert, UserRound, X } from "lucide-react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { requestDashboardApi } from "@/lib/dashboardApi";
import type { NotificationRecord, NotificationType } from "@/types/notifications";

type NotificationsResponse = {
  notifications: NotificationRecord[];
  unread_count: number;
};

const typeLabels: Record<NotificationType, string> = {
  system: "System",
  announcement: "Announcement",
  attendance: "Attendance",
  fees: "Fees",
  payment: "Payment",
  challan: "Challan",
  student: "Student",
  teacher: "Teacher",
  schedule: "Schedule",
  message: "Message",
  exam: "Exam",
  result: "Result",
  admission: "Admission",
  profile: "Profile",
  security: "Security",
};

function getTypeIcon(type: NotificationType) {
  if (type === "announcement") return <Megaphone className="h-5 w-5" />;
  if (type === "fees" || type === "payment" || type === "challan") return <ReceiptText className="h-5 w-5" />;
  if (type === "security") return <ShieldAlert className="h-5 w-5" />;
  if (type === "student" || type === "teacher" || type === "profile") return <UserRound className="h-5 w-5" />;
  return <BellRing className="h-5 w-5" />;
}

function getTypeTone(type: NotificationType, unread: boolean) {
  if (type === "fees" || type === "payment" || type === "challan") return unread ? "bg-emerald-100 text-emerald-700" : "bg-emerald-50 text-emerald-600";
  if (type === "attendance" || type === "schedule") return unread ? "bg-blue-100 text-blue-700" : "bg-blue-50 text-blue-600";
  if (type === "security") return unread ? "bg-red-100 text-red-700" : "bg-red-50 text-red-600";
  if (type === "announcement") return unread ? "bg-purple-100 text-purple-700" : "bg-purple-50 text-purple-600";
  return unread ? "bg-gray-100 text-gray-700" : "bg-gray-50 text-gray-600";
}

function relativeTime(value: string) {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hr${diffHours === 1 ? "" : "s"} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<NotificationRecord[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const loadNotifications = React.useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const payload = await requestDashboardApi<NotificationsResponse>("/api/notifications?mine=true&limit=12");
      setNotifications(payload.notifications);
      setUnreadCount(payload.unread_count);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadNotifications();
    const interval = window.setInterval(() => {
      void loadNotifications();
    }, 60000);
    return () => window.clearInterval(interval);
  }, [loadNotifications]);

  const toggleDropdown = () => {
    setIsOpen((current) => !current);
    if (!isOpen) void loadNotifications();
  };

  const closeDropdown = () => setIsOpen(false);

  const markRead = async (notification: NotificationRecord) => {
    if (!notification.read_at) {
      setNotifications((current) => current.map((item) => item.id === notification.id ? { ...item, read_at: new Date().toISOString() } : item));
      setUnreadCount((current) => Math.max(0, current - 1));
      try {
        await requestDashboardApi(`/api/notifications/${notification.id}`, {
          method: "PATCH",
          body: JSON.stringify({ read: true }),
        });
      } catch {
        void loadNotifications();
      }
    }
    closeDropdown();
  };

  const markAllRead = async () => {
    setNotifications((current) => current.map((item) => ({ ...item, read_at: item.read_at || new Date().toISOString() })));
    setUnreadCount(0);
    try {
      await requestDashboardApi("/api/notifications/mark-all-read", { method: "POST" });
    } catch {
      void loadNotifications();
    }
  };

  return (
    <div className="relative">
      <button
        className="dropdown-toggle relative flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={toggleDropdown}
        aria-label="Open notifications"
      >
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 z-10 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-40" />
          </span>
        )}
        <Bell className="h-5 w-5" />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute left-1/2 mt-[17px] flex h-[520px] w-[calc(100vw-2rem)] max-w-[420px] -translate-x-1/2 flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark md:left-auto md:right-0 md:translate-x-0 lg:right-0"
      >
        <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-700">
          <div>
            <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Notifications</h5>
            <p className="text-xs text-gray-500 dark:text-gray-400">{unreadCount} unread</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllRead}
              disabled={unreadCount === 0}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-gray-600 transition hover:bg-gray-100 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-white/5"
            >
              <CheckCheck className="h-4 w-4" />
              Read all
            </button>
            <button
              onClick={toggleDropdown}
              className="dropdown-toggle rounded-lg p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200"
              aria-label="Close notifications"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto">
          {loading ? (
            <div className="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400">Loading notifications...</div>
          ) : error ? (
            <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">{error}</div>
          ) : notifications.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400">No notifications yet.</div>
          ) : (
            <ul className="space-y-2">
              {notifications.map((notification) => {
                const unread = !notification.read_at;
                const content = (
                  <span className="flex min-w-0 gap-3">
                    <span className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${getTypeTone(notification.type, unread)}`}>
                      {getTypeIcon(notification.type)}
                      {unread && <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-orange-500 dark:border-gray-900" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-gray-900 dark:text-white">{notification.title}</span>
                      {notification.message && (
                        <span className="mt-0.5 line-clamp-2 block text-xs text-gray-500 dark:text-gray-400">{notification.message}</span>
                      )}
                      <span className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{typeLabels[notification.type]}</span>
                        <span className="h-1 w-1 rounded-full bg-gray-400" />
                        <span>{relativeTime(notification.created_at)}</span>
                        {notification.priority !== "normal" && (
                          <>
                            <span className="h-1 w-1 rounded-full bg-gray-400" />
                            <span className="capitalize">{notification.priority}</span>
                          </>
                        )}
                      </span>
                    </span>
                  </span>
                );

                return (
                  <li key={notification.id}>
                    <DropdownItem
                      tag={notification.action_url ? "a" : "button"}
                      href={notification.action_url || undefined}
                      onItemClick={() => markRead(notification)}
                      baseClassName="block w-full text-left"
                      className={`rounded-xl border px-3 py-3 transition ${
                        unread
                          ? "border-blue-100 bg-blue-50/60 hover:bg-blue-50 dark:border-blue-900/40 dark:bg-blue-900/10"
                          : "border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/5"
                      }`}
                    >
                      {content}
                    </DropdownItem>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <Link
          href="/dashboard/announcements"
          onClick={closeDropdown}
          className="mt-3 block rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          View All Notifications
        </Link>
      </Dropdown>
    </div>
  );
}

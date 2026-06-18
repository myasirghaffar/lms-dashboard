'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { useAuth } from '@/context/AuthContext';
import { requestDashboardApi } from '@/lib/dashboardApi';
import type { NotificationPayload, NotificationRecord, NotificationType } from '@/types/notifications';
import type { SystemUserRole } from '@/types/user-management';
import { BellRing, CheckCheck, Filter, Megaphone, Plus, ReceiptText, Search, Send, ShieldAlert, UserRound } from 'lucide-react';

type NotificationsResponse = {
  notifications: NotificationRecord[];
  unread_count: number;
};

const notificationTypes: { value: NotificationType; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'announcement', label: 'Announcement' },
  { value: 'attendance', label: 'Attendance' },
  { value: 'fees', label: 'Fees' },
  { value: 'payment', label: 'Payment' },
  { value: 'challan', label: 'Challan' },
  { value: 'student', label: 'Student' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'schedule', label: 'Schedule' },
  { value: 'message', label: 'Message' },
  { value: 'exam', label: 'Exam' },
  { value: 'result', label: 'Result' },
  { value: 'admission', label: 'Admission' },
  { value: 'profile', label: 'Profile' },
  { value: 'security', label: 'Security' },
];

const roleOptions: { value: SystemUserRole; label: string }[] = [
  { value: 'SUPER_ADMIN', label: 'Super Admin' },
  { value: 'BRANCH_ADMIN', label: 'Branch Admin' },
  { value: 'TEACHER', label: 'Teachers' },
  { value: 'STUDENT', label: 'Students' },
  { value: 'PARENT', label: 'Parents' },
];

const emptyPayload: NotificationPayload = {
  broadcast: false,
  target_roles: ['BRANCH_ADMIN'],
  type: 'announcement',
  priority: 'normal',
  title: '',
  message: '',
  action_url: '',
  entity_type: '',
  entity_id: '',
  metadata: {},
};

function getIcon(type: NotificationType) {
  if (type === 'announcement') return <Megaphone className="h-5 w-5" />;
  if (type === 'fees' || type === 'payment' || type === 'challan') return <ReceiptText className="h-5 w-5" />;
  if (type === 'security') return <ShieldAlert className="h-5 w-5" />;
  if (type === 'student' || type === 'teacher' || type === 'profile') return <UserRound className="h-5 w-5" />;
  return <BellRing className="h-5 w-5" />;
}

function tone(type: NotificationType, unread: boolean) {
  if (type === 'fees' || type === 'payment' || type === 'challan') return unread ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-50 text-emerald-600';
  if (type === 'security') return unread ? 'bg-red-100 text-red-700' : 'bg-red-50 text-red-600';
  if (type === 'announcement') return unread ? 'bg-purple-100 text-purple-700' : 'bg-purple-50 text-purple-600';
  return unread ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600';
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const canCreate = user?.role === 'SUPER_ADMIN' || user?.role === 'BRANCH_ADMIN';
  const [notifications, setNotifications] = React.useState<NotificationRecord[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('all');
  const [readFilter, setReadFilter] = React.useState('all');
  const [formOpen, setFormOpen] = React.useState(false);
  const [formData, setFormData] = React.useState<NotificationPayload>(emptyPayload);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const loadNotifications = React.useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ limit: '100', mine: canCreate ? 'false' : 'true' });
      if (typeFilter !== 'all') params.set('type', typeFilter);
      const payload = await requestDashboardApi<NotificationsResponse>(`/api/notifications?${params.toString()}`);
      setNotifications(payload.notifications);
      setUnreadCount(payload.unread_count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load notifications.');
    } finally {
      setLoading(false);
    }
  }, [canCreate, typeFilter]);

  React.useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const filteredNotifications = React.useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();
    return notifications.filter((notification) => {
      const matchesRead = readFilter === 'all'
        || (readFilter === 'unread' && !notification.read_at)
        || (readFilter === 'read' && notification.read_at);
      const haystack = [
        notification.title,
        notification.message,
        notification.type,
        notification.priority,
        notification.target_name,
        notification.created_by_name,
      ].filter(Boolean).join(' ').toLowerCase();
      return matchesRead && (!needle || haystack.includes(needle));
    });
  }, [notifications, readFilter, searchTerm]);

  const markRead = async (notification: NotificationRecord) => {
    setNotifications((current) => current.map((item) => item.id === notification.id ? { ...item, read_at: item.read_at || new Date().toISOString() } : item));
    if (!notification.read_at) setUnreadCount((current) => Math.max(0, current - 1));
    try {
      await requestDashboardApi(`/api/notifications/${notification.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ read: true }),
      });
    } catch {
      void loadNotifications();
    }
  };

  const markAllRead = async () => {
    setNotifications((current) => current.map((item) => ({ ...item, read_at: item.read_at || new Date().toISOString() })));
    setUnreadCount(0);
    try {
      await requestDashboardApi('/api/notifications/mark-all-read', { method: 'POST' });
    } catch {
      void loadNotifications();
    }
  };

  const toggleRole = (role: SystemUserRole) => {
    setFormData((current) => {
      const roles = current.target_roles || [];
      return {
        ...current,
        target_roles: roles.includes(role) ? roles.filter((item) => item !== role) : [...roles, role],
      };
    });
  };

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        ...formData,
        target_roles: formData.broadcast ? [] : formData.target_roles,
      };
      const response = await requestDashboardApi<{ created_count: number }>('/api/notifications', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setSuccess(`${response.created_count} notification${response.created_count === 1 ? '' : 's'} sent.`);
      setFormData(emptyPayload);
      setFormOpen(false);
      await loadNotifications();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create notification.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <PageBreadcrumb pageTitle="Notifications" />

        <div className="grid gap-4 md:grid-cols-3">
          <Metric label="Unread" value={String(unreadCount)} />
          <Metric label="Visible Records" value={String(filteredNotifications.length)} />
          <Metric label="Total Loaded" value={String(notifications.length)} />
        </div>

        {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">{error}</div>}
        {success && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300">{success}</div>}

        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="grid flex-1 gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search notifications..."
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>
              <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                <option value="all">All types</option>
                {notificationTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
              </select>
              <select value={readFilter} onChange={(event) => setReadFilter(event.target.value)} className="h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                <option value="all">All states</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={markAllRead} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                <CheckCheck className="h-4 w-4" />
                Mark Read
              </button>
              {canCreate && (
                <button onClick={() => setFormOpen((current) => !current)} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700">
                  <Plus className="h-4 w-4" />
                  Create
                </button>
              )}
            </div>
          </div>
        </div>

        {canCreate && formOpen && (
          <form onSubmit={handleCreate} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-5 flex items-center gap-2">
              <Send className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Create Notification</h2>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <Field label="Title">
                <input value={formData.title} onChange={(event) => setFormData((current) => ({ ...current, title: event.target.value }))} required className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
              </Field>
              <Field label="Type">
                <select value={formData.type} onChange={(event) => setFormData((current) => ({ ...current, type: event.target.value as NotificationType }))} className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                  {notificationTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
                </select>
              </Field>
              <Field label="Message">
                <textarea value={formData.message} onChange={(event) => setFormData((current) => ({ ...current, message: event.target.value }))} rows={4} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
              </Field>
              <div className="space-y-4">
                <Field label="Action URL">
                  <input value={formData.action_url} onChange={(event) => setFormData((current) => ({ ...current, action_url: event.target.value }))} placeholder="/dashboard/fees" className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
                </Field>
                <label className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
                  <input type="checkbox" checked={Boolean(formData.broadcast)} onChange={(event) => setFormData((current) => ({ ...current, broadcast: event.target.checked }))} className="h-4 w-4 rounded border-gray-300" />
                  Send to all users
                </label>
                {!formData.broadcast && (
                  <div className="grid grid-cols-2 gap-2">
                    {roleOptions.map((role) => (
                      <label key={role.value} className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-800 dark:text-gray-300">
                        <input type="checkbox" checked={formData.target_roles?.includes(role.value) || false} onChange={() => toggleRole(role.value)} />
                        {role.label}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <button disabled={saving} className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60">
                {saving ? 'Sending...' : 'Send Notification'}
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {loading ? (
            <div className="rounded-xl border border-gray-200 bg-white px-4 py-10 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">Loading notifications...</div>
          ) : filteredNotifications.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">No notifications match your filters.</div>
          ) : filteredNotifications.map((notification) => {
            const unread = !notification.read_at;
            return (
              <button key={notification.id} onClick={() => markRead(notification)} className={`w-full rounded-xl border p-4 text-left transition ${unread ? 'border-blue-100 bg-blue-50/60 dark:border-blue-900/40 dark:bg-blue-900/10' : 'border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800'}`}>
                <div className="flex gap-4">
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${tone(notification.type, unread)}`}>{getIcon(notification.type)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-bold text-gray-900 dark:text-white">{notification.title}</span>
                      {unread && <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700">Unread</span>}
                    </span>
                    {notification.message && <span className="mt-1 block text-sm text-gray-600 dark:text-gray-300">{notification.message}</span>}
                    <span className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>{notificationTypes.find((type) => type.value === notification.type)?.label || notification.type}</span>
                      <span>•</span>
                      <span>{formatDate(notification.created_at)}</span>
                      {notification.target_name && canCreate && <><span>•</span><span>To {notification.target_name}</span></>}
                      {notification.action_url && <><span>•</span><span>{notification.action_url}</span></>}
                    </span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </ProtectedRoute>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      {children}
    </label>
  );
}

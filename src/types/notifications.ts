import type { SystemUserRole } from '@/types/user-management';

export type NotificationType =
  | 'system'
  | 'announcement'
  | 'attendance'
  | 'fees'
  | 'payment'
  | 'challan'
  | 'student'
  | 'teacher'
  | 'schedule'
  | 'message'
  | 'exam'
  | 'result'
  | 'admission'
  | 'profile'
  | 'security';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface NotificationRecord {
  id: string;
  target_profile_id: string;
  created_by_profile_id: string | null;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  entity_type: string;
  entity_id: string;
  action_url: string;
  read_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  created_by_name?: string | null;
  target_name?: string | null;
}

export interface NotificationPayload {
  target_profile_ids?: string[];
  target_roles?: SystemUserRole[];
  broadcast?: boolean;
  type: NotificationType;
  priority?: NotificationPriority;
  title: string;
  message?: string;
  entity_type?: string;
  entity_id?: string;
  action_url?: string;
  metadata?: Record<string, unknown>;
}

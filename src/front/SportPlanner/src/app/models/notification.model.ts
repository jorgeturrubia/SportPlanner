export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration: number; // in milliseconds
  timestamp: Date;
  dismissed?: boolean;
}

export interface NotificationConfig {
  message: string;
  duration?: number; // optional, will use default if not provided
}
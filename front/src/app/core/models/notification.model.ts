export enum NotificationType {
    SUCCESS = 'success',
    ERROR = 'error',
    WARNING = 'warning',
    INFO = 'info'
}

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    duration?: number; // milliseconds, 0 = no auto-dismiss
    timestamp: Date;
    dismissible?: boolean;
    action?: NotificationAction;
}

export interface NotificationAction {
    label: string;
    callback: () => void;
}

export interface NotificationConfig {
    type: NotificationType;
    title: string;
    message: string;
    duration?: number;
    dismissible?: boolean;
    action?: NotificationAction;
}

import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = signal<Notification[]>([]);
  private notificationSubject = new BehaviorSubject<Notification[]>([]);

  constructor() {}

  /**
   * Get all notifications as a signal
   */
  getNotifications() {
    return this.notifications.asReadonly();
  }

  /**
   * Show a success notification
   */
  showSuccess(title: string, message?: string, duration: number = 5000): void {
    this.addNotification({
      type: 'success',
      title,
      message,
      duration
    });
  }

  /**
   * Show an error notification
   */
  showError(title: string, message?: string, persistent: boolean = false): void {
    this.addNotification({
      type: 'error',
      title,
      message,
      persistent,
      duration: persistent ? undefined : 8000
    });
  }

  /**
   * Show a warning notification
   */
  showWarning(title: string, message?: string, duration: number = 6000): void {
    this.addNotification({
      type: 'warning',
      title,
      message,
      duration
    });
  }

  /**
   * Show an info notification
   */
  showInfo(title: string, message?: string, duration: number = 5000): void {
    this.addNotification({
      type: 'info',
      title,
      message,
      duration
    });
  }

  /**
   * Remove a specific notification
   */
  removeNotification(id: string): void {
    const current = this.notifications();
    const updated = current.filter(n => n.id !== id);
    this.notifications.set(updated);
  }

  /**
   * Clear all notifications
   */
  clearAll(): void {
    this.notifications.set([]);
  }

  private addNotification(notification: Omit<Notification, 'id'>): void {
    const id = this.generateId();
    const newNotification: Notification = {
      ...notification,
      id
    };

    const current = this.notifications();
    this.notifications.set([...current, newNotification]);

    // Auto-remove notification after duration (if not persistent)
    if (!notification.persistent && notification.duration) {
      timer(notification.duration).subscribe(() => {
        this.removeNotification(id);
      });
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
import { Injectable, signal, computed } from '@angular/core';
import { Notification, NotificationConfig, NotificationType } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly DEFAULT_DURATION = 5000; // 5 seconds
  private readonly MAX_NOTIFICATIONS = 5; // Maximum number of notifications to show at once
  
  // Private signal for the notifications array
  private readonly _notifications = signal<Notification[]>([]);
  
  // Public readonly computed signal for accessing notifications
  public readonly notifications = computed(() => this._notifications());
  
  // Helper method to generate unique IDs
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  
  // Private method to add a notification to the queue
  private addNotification(type: NotificationType, config: NotificationConfig): void {
    const notification: Notification = {
      id: this.generateId(),
      type,
      message: config.message,
      duration: config.duration ?? this.DEFAULT_DURATION,
      timestamp: new Date(),
      dismissed: false
    };
    
    // Add notification to the beginning of the array (newest first)
    const currentNotifications = this._notifications();
    const updatedNotifications = [notification, ...currentNotifications];
    
    // Keep only the maximum number of notifications
    if (updatedNotifications.length > this.MAX_NOTIFICATIONS) {
      updatedNotifications.splice(this.MAX_NOTIFICATIONS);
    }
    
    this._notifications.set(updatedNotifications);
    
    // Auto-dismiss after the specified duration
    if (notification.duration > 0) {
      setTimeout(() => {
        this.dismissNotification(notification.id);
      }, notification.duration);
    }
  }
  
  // Public methods for showing different types of notifications
  public showSuccess(message: string, duration?: number): void {
    this.addNotification('success', { message, duration });
  }
  
  public showError(message: string, duration?: number): void {
    this.addNotification('error', { message, duration });
  }
  
  public showWarning(message: string, duration?: number): void {
    this.addNotification('warning', { message, duration });
  }
  
  public showInfo(message: string, duration?: number): void {
    this.addNotification('info', { message, duration });
  }
  
  // Method to manually dismiss a notification
  public dismissNotification(id: string): void {
    const currentNotifications = this._notifications();
    const updatedNotifications = currentNotifications.filter(notification => notification.id !== id);
    this._notifications.set(updatedNotifications);
  }
  
  // Method to dismiss all notifications
  public dismissAll(): void {
    this._notifications.set([]);
  }
  
  // Method to get the count of active notifications
  public readonly notificationCount = computed(() => this._notifications().length);
}
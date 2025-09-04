import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconsModule } from '@ng-icons/core';
import { 
  heroCheckCircle, 
  heroExclamationTriangle, 
  heroInformationCircle, 
  heroXCircle,
  heroXMark 
} from '@ng-icons/heroicons';
import { NotificationService } from '../../services/notification.service';
import { Notification, NotificationType } from '../../models/notification.model';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, NgIconsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgIconsModule.withIcons({
    heroCheckCircle,
    heroExclamationTriangle, 
    heroInformationCircle,
    heroXCircle,
    heroXMark
  })],
  template: `
    <div class="notification-container">
      @for (notification of notificationService.notifications(); track notification.id) {
        <div 
          class="notification-item"
          [class]="getNotificationClasses(notification.type)"
          role="alert"
          aria-live="polite"
        >
          <div class="notification-content">
            <div class="notification-icon">
              <ng-icon 
                [name]="getIconName(notification.type)"
                [class]="getIconClasses(notification.type)"
                size="20"
              />
            </div>
            <div class="notification-message">
              {{ notification.message }}
            </div>
            <button
              type="button"
              class="notification-dismiss"
              (click)="dismissNotification(notification.id)"
              aria-label="Dismiss notification"
            >
              <ng-icon 
                name="heroXMark" 
                class="text-current"
                size="16"
              />
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 50;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 24rem;
      width: 100%;
    }

    .notification-item {
      transform: translateX(100%);
      animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      border-radius: 0.5rem;
      padding: 1rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      border: 1px solid;
      backdrop-filter: blur(8px);
      transition: all 0.2s ease;
    }

    .notification-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .notification-content {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .notification-icon {
      flex-shrink: 0;
      margin-top: 0.125rem;
    }

    .notification-message {
      flex: 1;
      font-size: 0.875rem;
      line-height: 1.25rem;
      font-weight: 500;
    }

    .notification-dismiss {
      flex-shrink: 0;
      margin-left: 0.5rem;
      margin-top: 0.125rem;
      padding: 0.125rem;
      border-radius: 0.25rem;
      background: transparent;
      border: none;
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.2s ease;
    }

    .notification-dismiss:hover {
      opacity: 1;
    }

    .notification-dismiss:focus {
      outline: 2px solid var(--color-primary-green-500);
      outline-offset: 1px;
    }

    /* Success notification styles */
    .notification-success {
      background: linear-gradient(135deg, var(--color-primary-green-50), var(--color-primary-green-100));
      border-color: var(--color-primary-green-200);
      color: var(--color-primary-green-700);
    }

    .dark .notification-success {
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.2));
      border-color: var(--color-primary-green-600);
      color: var(--color-primary-green-200);
    }

    /* Error notification styles */
    .notification-error {
      background: linear-gradient(135deg, #fef2f2, #fee2e2);
      border-color: #fca5a5;
      color: #b91c1c;
    }

    .dark .notification-error {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.2));
      border-color: #dc2626;
      color: #fca5a5;
    }

    /* Warning notification styles */
    .notification-warning {
      background: linear-gradient(135deg, #fffbeb, #fef3c7);
      border-color: #fcd34d;
      color: #d97706;
    }

    .dark .notification-warning {
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.2));
      border-color: #f59e0b;
      color: #fcd34d;
    }

    /* Info notification styles */
    .notification-info {
      background: linear-gradient(135deg, #eff6ff, #dbeafe);
      border-color: #93c5fd;
      color: #1d4ed8;
    }

    .dark .notification-info {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.2));
      border-color: #3b82f6;
      color: #93c5fd;
    }

    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    /* Responsive design */
    @media (max-width: 640px) {
      .notification-container {
        left: 1rem;
        right: 1rem;
        max-width: none;
      }
      
      .notification-item {
        padding: 0.875rem;
      }
    }
  `]
})
export class NotificationComponent {
  protected readonly notificationService = inject(NotificationService);

  protected getNotificationClasses(type: NotificationType): string {
    return `notification-${type}`;
  }

  protected getIconName(type: NotificationType): string {
    const iconMap = {
      success: 'heroCheckCircle',
      error: 'heroXCircle',
      warning: 'heroExclamationTriangle',
      info: 'heroInformationCircle'
    };
    return iconMap[type];
  }

  protected getIconClasses(type: NotificationType): string {
    const classMap = {
      success: 'text-primary-green-600',
      error: 'text-red-600',
      warning: 'text-amber-600',
      info: 'text-blue-600'
    };
    return `${classMap[type]} dark:text-current`;
  }

  protected dismissNotification(id: string): void {
    this.notificationService.dismissNotification(id);
  }
}
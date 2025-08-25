import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, NgIcon],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      @for (notification of notifications(); track notification.id) {
        <div 
          [class]="getNotificationClasses(notification.type)"
          class="p-4 rounded-lg shadow-lg border transform transition-all duration-300 ease-in-out animate-slide-in">
          
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <ng-icon 
                [name]="getIconName(notification.type)" 
                [class]="getIconClasses(notification.type)"
                class="h-5 w-5">
              </ng-icon>
            </div>
            
            <div class="ml-3 flex-1">
              <h4 [class]="getTitleClasses(notification.type)" class="text-sm font-medium">
                {{ notification.title }}
              </h4>
              @if (notification.message) {
                <p [class]="getMessageClasses(notification.type)" class="text-sm mt-1">
                  {{ notification.message }}
                </p>
              }
            </div>
            
            <div class="ml-4 flex-shrink-0">
              <button
                (click)="removeNotification(notification.id)"
                [class]="getCloseButtonClasses(notification.type)"
                class="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors">
                <ng-icon name="heroXMark" class="h-4 w-4"></ng-icon>
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slide-in {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    .animate-slide-in {
      animation: slide-in 0.3s ease-out;
    }
  `]
})
export class NotificationComponent {
  notifications = computed(() => this.notificationService.getNotifications()());

  constructor(private notificationService: NotificationService) {}

  removeNotification(id: string): void {
    this.notificationService.removeNotification(id);
  }

  getNotificationClasses(type: Notification['type']): string {
    const baseClasses = 'bg-white border-l-4';
    
    switch (type) {
      case 'success':
        return `${baseClasses} border-green-500`;
      case 'error':
        return `${baseClasses} border-red-500`;
      case 'warning':
        return `${baseClasses} border-yellow-500`;
      case 'info':
        return `${baseClasses} border-blue-500`;
      default:
        return `${baseClasses} border-gray-500`;
    }
  }

  getIconName(type: Notification['type']): string {
    switch (type) {
      case 'success':
        return 'heroCheckCircle';
      case 'error':
        return 'heroExclamationTriangle';
      case 'warning':
        return 'heroExclamationTriangle';
      case 'info':
        return 'heroInformationCircle';
      default:
        return 'heroInformationCircle';
    }
  }

  getIconClasses(type: Notification['type']): string {
    switch (type) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      case 'info':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  }

  getTitleClasses(type: Notification['type']): string {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
      default:
        return 'text-gray-800';
    }
  }

  getMessageClasses(type: Notification['type']): string {
    switch (type) {
      case 'success':
        return 'text-green-700';
      case 'error':
        return 'text-red-700';
      case 'warning':
        return 'text-yellow-700';
      case 'info':
        return 'text-blue-700';
      default:
        return 'text-gray-700';
    }
  }

  getCloseButtonClasses(type: Notification['type']): string {
    const baseClasses = 'hover:bg-opacity-20';
    
    switch (type) {
      case 'success':
        return `${baseClasses} text-green-500 hover:bg-green-500 focus:ring-green-500`;
      case 'error':
        return `${baseClasses} text-red-500 hover:bg-red-500 focus:ring-red-500`;
      case 'warning':
        return `${baseClasses} text-yellow-500 hover:bg-yellow-500 focus:ring-yellow-500`;
      case 'info':
        return `${baseClasses} text-blue-500 hover:bg-blue-500 focus:ring-blue-500`;
      default:
        return `${baseClasses} text-gray-500 hover:bg-gray-500 focus:ring-gray-500`;
    }
  }
}
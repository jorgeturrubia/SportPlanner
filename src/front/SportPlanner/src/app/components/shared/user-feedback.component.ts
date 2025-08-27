import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';

export type FeedbackType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-user-feedback',
  standalone: true,
  imports: [CommonModule, NgIcon],
  template: `
    @if (message) {
      <div [class]="getContainerClasses()" class="rounded-md p-4 mb-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <ng-icon 
              [name]="getIconName()" 
              [class]="getIconClasses()"
              class="h-5 w-5">
            </ng-icon>
          </div>
          <div class="ml-3 flex-1">
            @if (title) {
              <h3 [class]="getTitleClasses()" class="text-sm font-medium">
                {{ title }}
              </h3>
            }
            <div [class]="getMessageClasses()" class="text-sm" [class.mt-1]="title">
              <p>{{ message }}</p>
              @if (details && details.length > 0) {
                <ul class="mt-2 list-disc list-inside space-y-1">
                  @for (detail of details; track detail) {
                    <li>{{ detail }}</li>
                  }
                </ul>
              }
            </div>
            @if (actionLabel && actionCallback) {
              <div class="mt-3">
                <button
                  (click)="actionCallback()"
                  [class]="getActionButtonClasses()"
                  class="text-sm font-medium rounded-md px-3 py-1 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  {{ actionLabel }}
                </button>
              </div>
            }
          </div>
          @if (dismissible) {
            <div class="ml-auto pl-3">
              <div class="-mx-1.5 -my-1.5">
                <button
                  (click)="dismiss()"
                  [class]="getDismissButtonClasses()"
                  class="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
                >
                  <ng-icon name="heroXMark" class="h-5 w-5"></ng-icon>
                </button>
              </div>
            </div>
          }
        </div>
      </div>
    }
  `
})
export class UserFeedbackComponent {
  @Input() type: FeedbackType = 'info';
  @Input() title?: string;
  @Input() message?: string;
  @Input() details?: string[];
  @Input() dismissible: boolean = false;
  @Input() actionLabel?: string;
  @Input() actionCallback?: () => void;

  dismiss(): void {
    this.message = undefined;
  }

  getContainerClasses(): string {
    const baseClasses = 'border-l-4';
    
    switch (this.type) {
      case 'success':
        return `${baseClasses} bg-green-50 border-green-400`;
      case 'error':
        return `${baseClasses} bg-red-50 border-red-400`;
      case 'warning':
        return `${baseClasses} bg-yellow-50 border-yellow-400`;
      case 'info':
        return `${baseClasses} bg-blue-50 border-blue-400`;
      default:
        return `${baseClasses} bg-gray-50 border-gray-400`;
    }
  }

  getIconName(): string {
    switch (this.type) {
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

  getIconClasses(): string {
    switch (this.type) {
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      case 'info':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  }

  getTitleClasses(): string {
    switch (this.type) {
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

  getMessageClasses(): string {
    switch (this.type) {
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

  getActionButtonClasses(): string {
    switch (this.type) {
      case 'success':
        return 'bg-green-100 text-green-800 hover:bg-green-200 focus:ring-green-600';
      case 'error':
        return 'bg-red-100 text-red-800 hover:bg-red-200 focus:ring-red-600';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 focus:ring-yellow-600';
      case 'info':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200 focus:ring-blue-600';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-600';
    }
  }

  getDismissButtonClasses(): string {
    switch (this.type) {
      case 'success':
        return 'text-green-500 hover:bg-green-100 focus:ring-green-600';
      case 'error':
        return 'text-red-500 hover:bg-red-100 focus:ring-red-600';
      case 'warning':
        return 'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600';
      case 'info':
        return 'text-blue-500 hover:bg-blue-100 focus:ring-blue-600';
      default:
        return 'text-gray-500 hover:bg-gray-100 focus:ring-gray-600';
    }
  }
}
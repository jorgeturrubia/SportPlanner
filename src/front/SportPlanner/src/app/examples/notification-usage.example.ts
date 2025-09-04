// Example: How to use the NotificationService in Angular 20+ components

import { Component, inject } from '@angular/core';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-example',
  standalone: true,
  template: `
    <div class="p-4">
      <h2 class="text-2xl font-bold mb-4">Notification System Examples</h2>
      
      <!-- Example buttons to trigger notifications -->
      <div class="space-y-2">
        <button 
          (click)="showLoginSuccess()" 
          class="bg-green-500 text-white px-4 py-2 rounded"
        >
          Show Login Success
        </button>
        
        <button 
          (click)="showTeamCreated()" 
          class="bg-green-500 text-white px-4 py-2 rounded"
        >
          Show Team Created
        </button>
        
        <button 
          (click)="showError()" 
          class="bg-red-500 text-white px-4 py-2 rounded"
        >
          Show Error
        </button>
        
        <button 
          (click)="showWarning()" 
          class="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Show Warning
        </button>
        
        <button 
          (click)="showInfo()" 
          class="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Show Info
        </button>
      </div>
    </div>
  `
})
export class NotificationUsageExampleComponent {
  private readonly notificationService = inject(NotificationService);
  
  // Example 1: Success notification with default duration (5 seconds)
  showLoginSuccess(): void {
    this.notificationService.showSuccess('Login successful!');
  }
  
  // Example 2: Success notification for team creation
  showTeamCreated(): void {
    this.notificationService.showSuccess('Team created successfully!');
  }
  
  // Example 3: Error notification
  showError(): void {
    this.notificationService.showError('Failed to create team. Please try again.');
  }
  
  // Example 4: Warning notification with custom duration (10 seconds)
  showWarning(): void {
    this.notificationService.showWarning('Your session will expire in 5 minutes.', 10000);
  }
  
  // Example 5: Info notification
  showInfo(): void {
    this.notificationService.showInfo('New feature available: Team analytics dashboard.');
  }
  
  // Example 6: Success notification with custom duration
  showCustomDuration(): void {
    this.notificationService.showSuccess('This will stay for 3 seconds only!', 3000);
  }
  
  // Example 7: Persistent notification (duration = 0 means it won't auto-dismiss)
  showPersistentNotification(): void {
    this.notificationService.showError('This error requires manual dismissal.', 0);
  }
}

/*
=== USAGE EXAMPLES ===

1. Basic Success Notification:
   this.notificationService.showSuccess('Operation completed successfully!');

2. Custom Duration (10 seconds):
   this.notificationService.showError('Critical error occurred.', 10000);

3. Persistent Notification (manual dismiss only):
   this.notificationService.showWarning('Please review your settings.', 0);

4. In Service Methods:
   async createTeam(teamData: TeamData): Promise<void> {
     try {
       await this.teamApi.create(teamData);
       this.notificationService.showSuccess('Team created successfully!');
     } catch (error) {
       this.notificationService.showError('Failed to create team.');
     }
   }

5. In Authentication:
   login(): void {
     this.authService.login().subscribe({
       next: () => this.notificationService.showSuccess('Welcome back!'),
       error: () => this.notificationService.showError('Invalid credentials.')
     });
   }

=== AVAILABLE METHODS ===

- showSuccess(message: string, duration?: number): void
- showError(message: string, duration?: number): void
- showWarning(message: string, duration?: number): void  
- showInfo(message: string, duration?: number): void
- dismissNotification(id: string): void
- dismissAll(): void

=== FEATURES ===

✅ Modern Angular 20+ with standalone components
✅ Signals for reactive state management
✅ TypeScript strict typing
✅ Auto-dismiss with configurable duration (default: 5 seconds)
✅ Manual dismissal with X button
✅ Queue management (max 5 notifications)
✅ Smooth slide-in animations from the right
✅ Responsive design with mobile support
✅ Accessibility features (ARIA labels, focus management)
✅ Icons from @ng-icons/heroicons
✅ Tailwind CSS styling matching project theme
✅ Dark mode support
✅ OnPush change detection for performance
*/
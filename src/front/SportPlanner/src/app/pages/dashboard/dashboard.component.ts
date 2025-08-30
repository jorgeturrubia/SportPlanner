import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  private readonly notificationService = inject(NotificationService);
  
  constructor(private router: Router) {}

  goHome(): void {
    this.router.navigate(['/']);
  }

  // Demo methods to show notification usage
  showSuccessNotification(): void {
    this.notificationService.showSuccess('Team created successfully!');
  }

  showErrorNotification(): void {
    this.notificationService.showError('Failed to create team. Please try again.');
  }

  showWarningNotification(): void {
    this.notificationService.showWarning('Your session will expire in 5 minutes.');
  }

  showInfoNotification(): void {
    this.notificationService.showInfo('New feature available: Team analytics dashboard.');
  }

  showCustomDurationNotification(): void {
    this.notificationService.showSuccess('This notification will disappear in 10 seconds!', 10000);
  }
}
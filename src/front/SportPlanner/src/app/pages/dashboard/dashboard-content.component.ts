import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-content.component.html',
  styleUrls: ['./dashboard-content.component.css']
})
export class DashboardContentComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  
  // Auth data
  currentUser$ = this.authService.currentUser$;

  navigateToTeams() {
    this.router.navigate(['/teams']);
  }

  navigateToPlanning() {
    this.router.navigate(['/planning']);
  }

  navigateToTraining() {
    this.router.navigate(['/training']);
  }
}
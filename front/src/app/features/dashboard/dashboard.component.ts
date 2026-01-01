import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SeasonOnboardingComponent } from './components/season-onboarding/season-onboarding.component';
import { SeasonService } from '../../services/season.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, NavbarComponent, SeasonOnboardingComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  sidebarCollapsed = signal(false);
  public seasonService = inject(SeasonService);

  ngOnInit() {
    this.seasonService.checkUserSeasons();
  }

  toggleSidebar() {
    this.sidebarCollapsed.update(v => !v);
  }
}

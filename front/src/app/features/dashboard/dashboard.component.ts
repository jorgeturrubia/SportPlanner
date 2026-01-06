import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
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
  private router = inject(Router);

  isWhiteboard = signal(false);

  constructor() {
    // Monitor route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
        this.checkRoute();
    });
  }

  ngOnInit() {
    this.seasonService.checkUserSeasons();
    this.checkRoute();
  }

  private checkRoute() {
      this.isWhiteboard.set(this.router.url.includes('/whiteboard'));
  }

  toggleSidebar() {
    this.sidebarCollapsed.update(v => !v);
  }
}

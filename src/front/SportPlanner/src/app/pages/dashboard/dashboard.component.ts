import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroBars3,
  heroXMark
} from '@ng-icons/heroicons/outline';

import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle.component';
import { SidebarService } from '../../core/services/sidebar.service';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NgIconComponent,
    SidebarComponent,
    ThemeToggleComponent
  ],
  providers: [
    provideIcons({
      heroBars3,
      heroXMark
    })
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  protected readonly sidebarService = inject(SidebarService);
  protected readonly themeService = inject(ThemeService);
  protected readonly authService = inject(AuthService);
  
  // Page configuration
  pageTitle = 'Dashboard';
  showDefaultContent = true;
  
  // Auth data
  currentUser$ = this.authService.currentUser$;
  
  // Computed properties
  protected readonly contentMarginLeft = computed(() => {
    // On mobile, no margin (sidebar is overlay)
    if (this.sidebarService.isMobileBreakpoint()) {
      return '0px';
    }
    
    // On desktop, adjust margin based on sidebar width
    return `${this.sidebarService.currentWidth()}px`;
  });
  
  constructor() {
    // Services are automatically initialized through their constructors
  }

  ngOnInit() {
    // Component initialization
  }
  
  onSignOut() {
    this.authService.signOut();
  }
}
import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { ThemeService } from '../../../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full'
  }
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private themeService = inject(ThemeService);

  readonly currentUser = this.authService.currentUser;
  readonly isDarkMode = this.themeService.isDarkMode;

  readonly welcomeMessage = computed(() => {
    const user = this.currentUser();
    if (!user) return 'Bienvenido';
    
    const name = user.firstName || user.email?.split('@')[0] || 'Usuario';
    const hour = new Date().getHours();
    
    if (hour < 12) {
      return `Buenos días, ${name}`;
    } else if (hour < 18) {
      return `Buenas tardes, ${name}`;
    } else {
      return `Buenas noches, ${name}`;
    }
  });

  onToggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
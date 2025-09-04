import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnInit {
  isMenuOpen = signal<boolean>(false);
  
  constructor(
    private router: Router,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {}

  toggleMenu(): void {
    this.isMenuOpen.update(current => !current);
  }

  scrollToSection(sectionId: string): void {
    this.isMenuOpen.set(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  navigateToAuth(): void {
    this.router.navigate(['/auth']);
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { NotificationComponent } from './components/notification/notification.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, NotificationComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('SportPlanner');
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    // AuthService initialization happens automatically in constructor
    // This ensures auth state is properly loaded before any route guards are executed
    console.log('App initialized - Auth service is ready');
  }
}

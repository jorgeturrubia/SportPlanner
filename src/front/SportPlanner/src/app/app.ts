import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationComponent } from './components/notification/notification.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  constructor(private authService: AuthService) {
    console.log('🚀 App component loaded with router and notifications');
  }

  ngOnInit() {
    console.log('🔐 AuthService initialized safely:', {
      isLoading: this.authService.isLoading(),
      isAuthenticated: this.authService.isAuthenticated(),
      isInitialized: this.authService.isInitialized()
    });
  }
}
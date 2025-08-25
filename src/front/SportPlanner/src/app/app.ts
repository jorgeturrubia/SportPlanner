import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { NotificationComponent } from './components/shared/notification.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, NotificationComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('SportPlanner');
}

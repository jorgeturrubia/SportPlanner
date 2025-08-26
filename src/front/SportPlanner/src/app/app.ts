import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { NotificationComponent } from './components/shared/notification.component';
import { ModalContainerComponent } from './components/shared/modal-container.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, NotificationComponent, ModalContainerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('SportPlanner');
}

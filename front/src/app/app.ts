import { Component, signal, inject, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationContainerComponent } from './shared/components/notification-container/notification-container.component';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationContainerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {


  constructor() {
    // Log auth state when auth changes. Avoid calling backend here to prevent duplicate

  }



}

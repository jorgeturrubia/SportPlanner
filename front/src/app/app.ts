import { Component, signal, inject, effect } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {


  constructor() {
    // Log auth state when auth changes. Avoid calling backend here to prevent duplicate
  
  }


  
}

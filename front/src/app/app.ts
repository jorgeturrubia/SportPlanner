import { Component, signal, inject, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {


  constructor() {
    // Log auth state when auth changes. Avoid calling backend here to prevent duplicate
  
  }


  
}

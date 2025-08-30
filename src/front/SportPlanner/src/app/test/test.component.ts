import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  standalone: true,
  template: `
    <div style="background: green; color: white; padding: 40px; text-align: center;">
      <h1>HELLO WORLD - TEST COMPONENT</h1>
      <p>If you see this, Angular is working!</p>
      <p>Current time: {{ currentTime }}</p>
    </div>
  `
})
export class TestComponent {
  currentTime = new Date().toLocaleTimeString();
  
  constructor() {
    console.log('🧪 TestComponent loaded successfully');
  }
}
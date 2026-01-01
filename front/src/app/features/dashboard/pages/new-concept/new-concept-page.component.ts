import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ConceptCreatorComponent } from '../../../proposals/components/concept-creator/concept-creator.component';

@Component({
  selector: 'app-new-concept-page',
  standalone: true,
  imports: [CommonModule, ConceptCreatorComponent],
  template: `
    <div class="h-full bg-dark-bg p-4">
      <div class="max-w-6xl mx-auto h-full">
        <app-concept-creator 
          (close)="onClose()" 
          (conceptCreated)="onConceptCreated($event)">
        </app-concept-creator>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class NewConceptPageComponent {
  constructor(private router: Router) {}

  onClose() {
    this.router.navigate(['/dashboard']);
  }

  onConceptCreated(concept: any) {
    console.log('Concepto creado:', concept);
  }
}

import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingSessionExercise } from '../../../../core/models/training-session.model';

@Component({
  selector: 'app-exercise-flow',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exercise-flow.html',
  styleUrls: ['./exercise-flow.css']
})
export class ExerciseFlowComponent implements OnChanges {
  @Input() exercises: TrainingSessionExercise[] = [];
  @Input() currentIndex: number = 0;

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentIndex']) {
      this.scrollToActive();
    }
  }

  scrollToActive() {
    // Small delay to ensure render
    setTimeout(() => {
      if (this.scrollContainer) {
        const activeEl = this.scrollContainer.nativeElement.querySelector('.exercise-active');
        if (activeEl) {
          activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, 100);
  }
}

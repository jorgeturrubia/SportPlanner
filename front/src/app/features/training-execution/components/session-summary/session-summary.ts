import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrainingSession } from '../../../../core/models/training-session.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-session-summary',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './session-summary.html',
  styleUrls: ['./session-summary.css']
})
export class SessionSummaryComponent {
  @Input() session!: TrainingSession;
  @Output() submitFeedback = new EventEmitter<{ rating: number, notes?: string }>();

  rating: number = 0;
  notes: string = '';

  setRating(r: number) {
    this.rating = r;
  }

  submit() {
    this.submitFeedback.emit({ rating: this.rating, notes: this.notes });
  }

  get completedCount(): number {
    return this.session.sessionExercises.filter(e => e.isCompleted).length;
  }

  get totalDuration(): number {
    return this.session.sessionExercises.reduce((acc, curr) => acc + (curr.actualDurationMinutes || 0), 0);
  }
}

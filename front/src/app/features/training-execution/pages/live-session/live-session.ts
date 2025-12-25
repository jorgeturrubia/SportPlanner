import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TrainingExecutionService, SessionExecutionState } from '../../../../services/training-execution.service';
import { TrainingSessionService } from '../../../../services/training-session.service';

@Component({
  selector: 'app-live-session',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule
  ],
  templateUrl: './live-session.html',
  styleUrls: ['./live-session.css']
})
export class LiveSessionComponent implements OnInit, OnDestroy {
  // Inject Service using inject() to allow property initialization usage
  public executionService = inject(TrainingExecutionService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Expose signals from the service directly to the template
  state = this.executionService.state;
  session = this.executionService.session;
  activeExercise = this.executionService.activeExercise;
  nextExercise = this.executionService.nextExercise;
  generalTime = this.executionService.generalTime;
  exerciseTime = this.executionService.exerciseTime;

  // SessionExecutionState for template usage
  SessionExecutionState = SessionExecutionState;

  // Initial ID to load
  sessionId!: number;

  constructor() { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.sessionId = +id;
        this.executionService.initializeSession(this.sessionId).subscribe({
          error: (err) => console.error('Failed to init session', err)
        });
      }
    });
  }

  ngOnDestroy() {
    // Service handles its own cleanup if needed.
  }

  togglePlayPause() {
    if (this.state() === SessionExecutionState.Running) {
      this.executionService.pauseSession();
    } else if (this.state() === SessionExecutionState.Paused) {
      this.executionService.resumeSession();
    }
  }

  next() {
    this.executionService.goToNextExercise();
  }

  prev() {
    this.executionService.goToPreviousExercise();
  }

  formatTime(seconds: number): string {
    return this.executionService.formatTime(seconds);
  }

  get progressPercentage(): number {
    const s = this.session();
    if (!s || !s.sessionExercises || s.sessionExercises.length === 0) return 0;
    // +1 because we are at the current index (0-based)
    return ((this.executionService.currentExerciseIndex() + 1) / s.sessionExercises.length) * 100;
  }
}

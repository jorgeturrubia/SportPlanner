import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TrainingExecutionService } from '../../../../services/training-execution.service';
import { TrainingSessionService } from '../../../../services/training-session.service';
import { TrainingSession, TrainingSessionExercise, TrainingSessionStatus } from '../../../../core/models/training-session.model';
import { ExerciseTimerComponent } from '../../components/exercise-timer/exercise-timer';
import { ExerciseFlowComponent } from '../../components/exercise-flow/exercise-flow';
import { SessionSummaryComponent } from '../../components/session-summary/session-summary';

@Component({
  selector: 'app-live-session',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    ExerciseTimerComponent,
    ExerciseFlowComponent,
    SessionSummaryComponent
  ],
  templateUrl: './live-session.html',
  styleUrls: ['./live-session.css']
})
export class LiveSessionComponent implements OnInit, OnDestroy {
  sessionId!: number;
  session: TrainingSession | null = null;
  currentExerciseIndex: number = 0;

  // Local state
  activeExercise: TrainingSessionExercise | null = null;
  isSessionFinished: boolean = false;

  sessionDuration: string = '00:00:00';
  private sessionTimerInterval: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private executionService: TrainingExecutionService,
    private sessionService: TrainingSessionService
  ) { }

  ngOnDestroy() {
    if (this.sessionTimerInterval) {
      clearInterval(this.sessionTimerInterval);
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.sessionId = +id;
        this.loadSession();
      }
    });
  }

  loadSession() {
    this.sessionService.getById(this.sessionId).subscribe(data => {
      this.session = data;
      this.initializeSessionState();
    });
  }

  initializeSessionState() {
    if (!this.session) return;

    if (this.session.status === 'Completed') {
      this.isSessionFinished = true;
      return;
    }

    if (this.session.status === 'InProgress' && this.session.startedAt) {
      this.startGlobalTimer();
    }

    // Find first incomplete exercise or start at 0
    // Assuming 'sessionExercises' is ordered
    const firstIncomplete = this.session.sessionExercises.findIndex(e => !e.isCompleted);
    this.currentExerciseIndex = firstIncomplete >= 0 ? firstIncomplete : 0;
    this.updateActiveExercise();
  }

  updateActiveExercise() {
    if (this.session && this.session.sessionExercises && this.session.sessionExercises.length > 0) {
      this.activeExercise = this.session.sessionExercises[this.currentExerciseIndex];
    }
  }

  startSession() {
    if (this.session?.status === 'Planned') {
      this.executionService.startSession(this.sessionId).subscribe(updated => {
        this.session = updated;
        this.initializeSessionState(); // Sync active exercise and state
      });
    }
  }

  startGlobalTimer() {
    if (this.sessionTimerInterval) clearInterval(this.sessionTimerInterval);

    this.sessionTimerInterval = setInterval(() => {
      if (!this.session?.startedAt) return;

      const start = new Date(this.session.startedAt).getTime();
      const now = new Date().getTime();
      const diff = now - start;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      this.sessionDuration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
  }

  completeCurrentExercise(data: { duration: number, notes?: string }) {
    // Current logic marks it as done. User asked for "notification".
    // For now, let's mark as done and maybe show a toast or transition. 
    // Ideally, we'd pause and ask "Next?", but user said "skip notification", maybe automated.
    // "saltar una notificacion de seguimos con el siguiente??" -> "Pop up a notification asking 'continue to next?'"

    // Let's invoke a simple confirmation via window.confirm for MVP or better, a custom flag state.
    const proceed = window.confirm("¡Tiempo completado! ¿Pasar al siguiente ejercicio?");
    if (proceed) {
      this.forceComplete(data);
    }
  }

  forceComplete(data: { duration: number, notes?: string }) {
    if (!this.activeExercise) return;

    this.executionService.completeExercise(this.activeExercise.id, data.duration, data.notes).subscribe(updatedEx => {
      if (this.session) {
        const idx = this.session.sessionExercises.findIndex(e => e.id === updatedEx.id);
        if (idx >= 0) {
          this.session.sessionExercises[idx] = updatedEx;
        }
      }
      this.nextExercise();
    });
  }

  prevExercise() {
    if (!this.session) return;
    if (this.currentExerciseIndex > 0) {
      this.currentExerciseIndex--;
      this.updateActiveExercise();
    }
  }

  nextExercise() {
    if (!this.session) return;

    if (this.currentExerciseIndex < this.session.sessionExercises.length - 1) {
      this.currentExerciseIndex++;
      this.updateActiveExercise();
    } else {
      // Finished all exercises
      this.activeExercise = null;
      // Prompt to finish session?
      this.isSessionFinished = true;
    }
  }

  finishSession(data: { rating: number, notes?: string }) {
    this.executionService.finishSession(this.sessionId, data.rating, data.notes).subscribe(updated => {
      this.session = updated;
      this.isSessionFinished = true;
      // Maybe navigate away or show summary
      // For now, staying on summary view
    });
  }
}

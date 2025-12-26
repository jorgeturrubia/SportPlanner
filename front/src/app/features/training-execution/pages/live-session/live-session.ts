import { Component, OnInit, inject, signal, effect, computed, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingExecutionService, SessionExecutionState } from '../../../../services/training-execution.service';
import { TrainingSession } from '../../../../core/models/training-session.model';

interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'comment' | 'alert';
}

@Component({
  selector: 'app-live-session',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './live-session.html',
  styleUrls: ['./live-session.css']
})
export class LiveSessionComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public executionService = inject(TrainingExecutionService);

  // Local UI State
  isLoading = signal<boolean>(true);
  showFinishModal = signal<boolean>(false);
  newComment = signal<string>('');

  // Comments List (Loaded from session + new ones)
  comments = signal<string[]>([]);

  // Derived state from Service
  currentState = this.executionService.state;
  generalTime = this.executionService.generalTime;
  exerciseTime = this.executionService.exerciseTime;
  activeExercise = this.executionService.activeExercise;

  // Computed for UI
  generalTimeFormatted = computed(() => this.executionService.formatTime(this.generalTime()));
  exerciseTimeFormatted = computed(() => this.executionService.formatTime(this.exerciseTime()));

  progressBarWidth = computed(() => {
    // Simple progress based on exercise index vs total
    const session = this.executionService.session();
    if (!session || !session.sessionExercises || session.sessionExercises.length === 0) return 0;
    const current = this.executionService.currentExerciseIndex();
    const total = session.sessionExercises.length;
    return Math.min(100, ((current + 1) / total) * 100);
  });

  // UI Context Helpers
  nextExercise = this.executionService.nextExercise;

  previousExercise = computed(() => {
    const session = this.executionService.session();
    if (!session || !session.sessionExercises) return null;
    const index = this.executionService.currentExerciseIndex();
    return index > 0 ? session.sessionExercises[index - 1] : null;
  });

  allExercises = computed(() => this.executionService.session()?.sessionExercises || []);

  constructor() {
    effect(() => {
      // Sync comments if session changes (reloads)
      const session = this.executionService.session();
      if (session && session.comments) {
        // Initialize comments if empty or just overwrite? 
        // Better to merge usage, but for now let's load what's there.
        // Since this is a new live session, we might start with what's in DB.
        // Note: Signal effect might behave unexpectedly if we update the signal inside.
        // Best to do this in loadSession callback.
      }
    });
  }

  ngOnInit() {
    const sessionId = this.route.snapshot.paramMap.get('id');
    if (sessionId) {
      this.loadSession(+sessionId);
    } else {
      this.isLoading.set(false);
    }
  }

  ngOnDestroy() {
    // Service handles its own cleanup of the timer interval
  }

  private loadSession(id: number) {
    this.isLoading.set(true);
    this.executionService.initializeSession(id).subscribe({
      next: (session) => {
        this.isLoading.set(false);
        // Load existing comments into local state
        if (session.comments) {
          this.comments.set(session.comments);
        }
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  // --- ACTIONS ---

  togglePause() {
    if (this.currentState() === SessionExecutionState.Running) {
      this.executionService.pauseSession();
    } else if (this.currentState() === SessionExecutionState.Paused || this.currentState() === SessionExecutionState.Idle) {
      const session = this.executionService.session();
      if (session && this.currentState() === SessionExecutionState.Idle) {
        this.executionService.startSession(session.id).subscribe();
      } else {
        this.executionService.resumeSession();
      }
    }
  }

  goToNextExercise() {
    this.executionService.goToNextExercise();
  }

  prevExercise() {
    this.executionService.goToPreviousExercise();
  }

  addQuickComment() {
    const text = this.newComment().trim();
    if (!text) return;

    // Format: "HH:mm:ss - Comment"
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedComment = `${timestamp} - ${text}`;

    this.comments.update(list => [formattedComment, ...list]);
    this.newComment.set('');

    // Ideally, save to backend immediately here if API supports it.
    // For now, we update local state which will be sent on finish (if we modify finish logic)
    // or we assume auto-save.
    // Given user said "puedo ir añadiendo mas", local sync is fine for MVP.
  }

  finishSession() {
    const session = this.executionService.session();
    if (!session) return;

    // Update session object with latest comments before sending?
    // The service might not look at this component's signal.
    // We should pass comments or ensure service has them.
    // For now, let's keep using feedbackNotes for the aggregated fallback, 
    // BUT since we added comments to the model, we should probably send them if the update endpoint supports it.

    // We will stick to the existing finishSession signature but maybe send comments too if we had a proper DTO.
    // Since we can't easily change the Service signature completely right now without seeing it,
    // we'll leave basic finish functionality.

    // Important: The user asked to remove "Bitacora" log logic.

    this.executionService.finishSession(session.id, 5, "Sesión finalizada", this.comments()).subscribe({
      next: () => {
        this.router.navigate(['/training-execution']);
      },
      error: (err) => console.error(err)
    });
  }
}

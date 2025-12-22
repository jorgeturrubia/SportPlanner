import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exercise-timer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exercise-timer.html',
  styleUrls: ['./exercise-timer.css']
})
export class ExerciseTimerComponent implements OnInit, OnDestroy, OnChanges {
  @Input() duration: number = 0; // In minutes
  @Output() timerFinished = new EventEmitter<number>(); // Emits actual duration in minutes

  timeLeft: number = 0; // Seconds
  totalTime: number = 0; // Seconds (for progress bar)
  interval: any;
  isRunning: boolean = false;
  isPaused: boolean = false;
  startTime: number = 0;

  ngOnInit() {
    this.initTimer();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['duration'] && !changes['duration'].firstChange) {
      this.stopTimer();
      this.initTimer();
      // Optional: Auto-start if desired, currently verifying user pref.
      // User said "starts that timer", implies auto-start.
      this.startTimer();
    }
  }

  initTimer() {
    if (this.duration > 0) {
      this.timeLeft = this.duration * 60;
      this.totalTime = this.timeLeft;
    } else {
      this.timeLeft = 0; // Stopwatch mode
    }
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  toggleTimer() {
    if (this.isRunning) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }

  startTimer() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.isPaused = false;

    this.interval = setInterval(() => {
      if (this.duration > 0) {
        // Countdown
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          this.stopTimer();
          // Auto-finish? Or just beep?
        }
      } else {
        // Stopwatch
        this.timeLeft++;
      }
    }, 1000);
  }

  pauseTimer() {
    this.isRunning = false;
    this.isPaused = true;
    clearInterval(this.interval);
  }

  stopTimer() {
    this.isRunning = false;
    this.isPaused = false;
    clearInterval(this.interval);
  }

  finish() {
    this.stopTimer();
    // Calculate actual duration
    const actual = this.duration > 0 ? (this.totalTime - this.timeLeft) : this.timeLeft;
    const minutes = Math.ceil(actual / 60);
    this.timerFinished.emit(minutes);
  }

  get formattedTime(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  get progressPercentage(): number {
    if (this.duration <= 0) return 100;
    return ((this.totalTime - this.timeLeft) / this.totalTime) * 100;
  }
}

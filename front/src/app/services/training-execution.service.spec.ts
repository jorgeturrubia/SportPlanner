import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TrainingExecutionService, SessionExecutionState } from './training-execution.service';
import { TrainingSession } from '../core/models/training-session.model';

describe('TrainingExecutionService', () => {
  let service: TrainingExecutionService;
  let httpMock: HttpTestingController;

  const mockSession: TrainingSession = {
    id: 1,
    teamId: 1,
    date: '2025-12-25',
    status: 'Planned',
    sessionConcepts: [],
    sessionExercises: [
      { id: 101, order: 1, durationMinutes: 1, isCompleted: false },
      { id: 102, order: 2, durationMinutes: 2, isCompleted: false }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TrainingExecutionService]
    });
    service = TestBed.inject(TrainingExecutionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    // Ensure we stop any running timer to prevent leaks
    service.state.set(SessionExecutionState.Idle);
    TestBed.flushEffects(); 
  });

  it('should initialize with Idle state', () => {
    expect(service.state()).toBe(SessionExecutionState.Idle);
  });

  it('should transition to Running on startSession', () => {
    service.session.set(mockSession);
    service.startSession(1).subscribe();
    
    const req = httpMock.expectOne(`${service['apiUrl']}/start/1`);
    req.flush({ ...mockSession, status: 'InProgress' });
    TestBed.flushEffects();

    expect(service.state()).toBe(SessionExecutionState.Running);
    expect(service.exerciseTime()).toBe(60); // 1 minute
  });

  it('should increment generalTime and decrement exerciseTime on tick', () => {
    service.session.set(mockSession);
    service.state.set(SessionExecutionState.Running);
    service.currentExerciseIndex.set(0);
    service.exerciseTime.set(60);
    service.generalTime.set(0);

    service.tick();

    expect(service.generalTime()).toBe(1);
    expect(service.exerciseTime()).toBe(59);
  });

  it('should auto-transition to next exercise when timer reaches zero', () => {
    service.session.set(mockSession);
    service.currentExerciseIndex.set(0);
    service.exerciseTime.set(1); // 1 second left
    service.state.set(SessionExecutionState.Running);
    
    service.tick();
    
    expect(service.currentExerciseIndex()).toBe(1);
    expect(service.exerciseTime()).toBe(120); // 2 minutes from next exercise (id 102)
  });

  it('should format time correctly', () => {
    expect(service.formatTime(0)).toBe('00:00:00');
    expect(service.formatTime(65)).toBe('00:01:05');
    expect(service.formatTime(3661)).toBe('01:01:01');
  });

  it('should handle manual navigation', () => {
    service.session.set(mockSession);
    service.currentExerciseIndex.set(0);
    
    service.goToNextExercise();
    expect(service.currentExerciseIndex()).toBe(1);
    
    service.goToPreviousExercise();
    expect(service.currentExerciseIndex()).toBe(0);
  });
});
using System.ComponentModel.DataAnnotations;

namespace SportPlanner.Models;

public class TrainingSession
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public int TeamId { get; set; }
    public Team? Team { get; set; }

    public DateTime Date { get; set; }
    public TimeSpan? StartTime { get; set; }
    public TimeSpan? Duration { get; set; }

    public int? CourtId { get; set; }
    public Court? Court { get; set; }

    public int? PlanningId { get; set; }
    public Planning? Planning { get; set; }

    // Objectives selected for this training (from the planning)
    public ICollection<TrainingSessionConcept> SessionConcepts { get; set; } = new List<TrainingSessionConcept>();

    // Exercises included in this training
    public ICollection<TrainingSessionExercise> SessionExercises { get; set; } = new List<TrainingSessionExercise>();

    // Live Execution Tracking
    public TrainingSessionStatus Status { get; set; } = TrainingSessionStatus.Planned;
    public DateTime? StartedAt { get; set; }
    public DateTime? FinishedAt { get; set; }

    // Feedback
    public int? FeedbackRating { get; set; } // 1-5 or 1-10
    public string? FeedbackNotes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class TrainingSessionConcept
{
    public int Id { get; set; }

    public int TrainingSessionId { get; set; }
    public TrainingSession? TrainingSession { get; set; }

    public int SportConceptId { get; set; }
    public SportConcept? SportConcept { get; set; }

    public int Order { get; set; }
    public int? DurationMinutes { get; set; }
    public string? OverrideDescription { get; set; }
}

public class TrainingSessionExercise
{
    public int Id { get; set; }

    public int TrainingSessionId { get; set; }
    public TrainingSession? TrainingSession { get; set; }

    // Can be from library
    public int? ExerciseId { get; set; }
    public Exercise? Exercise { get; set; }

    // Or custom text ("algo especial")
    public string? CustomText { get; set; }

    // Can also refer to a specific concept if needed
    public int? SportConceptId { get; set; }
    public SportConcept? SportConcept { get; set; }

    public int Order { get; set; }
    public int? DurationMinutes { get; set; }

    // Execution Logic
    public bool IsCompleted { get; set; }
    public int? ActualDurationMinutes { get; set; }
    public string? FeedbackNotes { get; set; }
}

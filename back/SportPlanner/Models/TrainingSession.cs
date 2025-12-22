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

    // Objectives selected for this training (from the planning)
    public ICollection<TrainingSessionConcept> SessionConcepts { get; set; } = new List<TrainingSessionConcept>();

    // Exercises included in this training
    public ICollection<TrainingSessionExercise> SessionExercises { get; set; } = new List<TrainingSessionExercise>();

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
}

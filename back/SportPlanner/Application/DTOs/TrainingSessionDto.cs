using System;
using System.Collections.Generic;

namespace SportPlanner.Application.DTOs;

public class TrainingSessionConceptDto
{
    public int Id { get; set; }
    public int SportConceptId { get; set; }
    public string? ConceptName { get; set; }
    public string? ConceptDescription { get; set; }
    public string? ConceptCategoryName { get; set; }
    public int Order { get; set; }
    public int? DurationMinutes { get; set; }
}

public class TrainingSessionExerciseDto
{
    public int Id { get; set; }
    public int? ExerciseId { get; set; }
    public string? ExerciseName { get; set; }
    public string? ExerciseDescription { get; set; }
    public string? ExerciseMediaUrl { get; set; }
    public string? CustomText { get; set; }
    public int? SportConceptId { get; set; }
    public string? SportConceptName { get; set; }
    public int Order { get; set; }
    public int? DurationMinutes { get; set; }
    // Execution Logic
    public bool IsCompleted { get; set; }
    public int? ActualDurationMinutes { get; set; }
    public string? FeedbackNotes { get; set; }
}

public class TrainingSessionDto
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public int TeamId { get; set; }
    public DateTime Date { get; set; }
    public TimeSpan? StartTime { get; set; }
    public TimeSpan? Duration { get; set; }
    public int? CourtId { get; set; }
    public int? PlanningId { get; set; }
    public string? PlanningName { get; set; }


    // Live Execution Tracking
    public string Status { get; set; } = "Planned"; // Enum as string
    public DateTime? StartedAt { get; set; }
    public DateTime? FinishedAt { get; set; }

    // Feedback
    public int? FeedbackRating { get; set; }
    public string? FeedbackNotes { get; set; }

    public List<TrainingSessionConceptDto> SessionConcepts { get; set; } = new();
    public List<TrainingSessionExerciseDto> SessionExercises { get; set; } = new();
}

public class CreateTrainingSessionDto
{
    public string? Name { get; set; }
    public int TeamId { get; set; }
    public DateTime Date { get; set; }
    public TimeSpan? StartTime { get; set; }
    public TimeSpan? Duration { get; set; }
    public int? CourtId { get; set; }
    public int? PlanningId { get; set; }
    public List<CreateTrainingSessionConceptDto>? SessionConcepts { get; set; }
    public List<CreateTrainingSessionExerciseDto>? SessionExercises { get; set; }
}

public class CreateTrainingSessionConceptDto
{
    public int SportConceptId { get; set; }
    public int Order { get; set; }
    public int? DurationMinutes { get; set; }
    public string? OverrideDescription { get; set; }
}

public class CreateTrainingSessionExerciseDto
{
    public int? ExerciseId { get; set; }
    public string? CustomText { get; set; }
    public int? SportConceptId { get; set; }
    public int Order { get; set; }
    public int? DurationMinutes { get; set; }
}

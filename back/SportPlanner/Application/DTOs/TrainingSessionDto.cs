using System.Collections.Generic;

namespace SportPlanner.Application.DTOs;

public class SessionConceptDto
{
    public int Id { get; set; }
    public int SportConceptId { get; set; }
    public int Order { get; set; }
    public int? PlannedDurationMinutes { get; set; }
    public string? Notes { get; set; }
}

public class TrainingSessionDto
{
    public int Id { get; set; }
    public int? TrainingScheduleId { get; set; }
    public DateTime StartAt { get; set; }
    public TimeSpan Duration { get; set; }
    public int? CourtId { get; set; }
    public List<SessionConceptDto> SessionConcepts { get; set; } = new();
}

public class TrainingSessionCreateDto
{
    public int? TrainingScheduleId { get; set; }
    public DateTime StartAt { get; set; }
    public TimeSpan Duration { get; set; }
    public int? CourtId { get; set; }
    public List<SessionConceptDto>? SessionConcepts { get; set; }
    // Optionally: selection parameters for auto generation
    public string? Phase { get; set; }
    public int? MaxDifficultyLevelId { get; set; }
    public int? AvailableTimeMinutes { get; set; }
}

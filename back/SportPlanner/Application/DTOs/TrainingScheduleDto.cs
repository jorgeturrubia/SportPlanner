using System.Collections.Generic;

namespace SportPlanner.Application.DTOs;

public class PlanConceptDto
{
    public int Id { get; set; }
    public int SportConceptId { get; set; }
    public SportConceptDto? SportConcept { get; set; }
}

public class TrainingScheduleDayDto
{
    public int Id { get; set; }
    public string DayOfWeek { get; set; } = null!;
    public string StartTime { get; set; } = null!; // HH:mm
    public string? EndTime { get; set; }
    public int? CourtId { get; set; }
}

public class TrainingScheduleDto
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public List<TrainingScheduleDayDto> ScheduleDays { get; set; } = new();
    public List<PlanConceptDto> PlanConcepts { get; set; } = new();
}

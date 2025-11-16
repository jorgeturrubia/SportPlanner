using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace SportPlanner.Application.DTOs;

public class TrainingScheduleDayCreateDto
{
    public string DayOfWeek { get; set; } = null!;
    public string StartTime { get; set; } = null!; // HH:mm
    public string? EndTime { get; set; } // HH:mm optional
    public int? CourtId { get; set; }
}

public class TrainingScheduleCreateDto
{
    public string? Name { get; set; }
    [Required] public DateTime StartDate { get; set; }
    [Required] public DateTime EndDate { get; set; }
    public List<TrainingScheduleDayCreateDto> ScheduleDays { get; set; } = new();
    public List<int> PlanConceptIds { get; set; } = new(); // list of SportConcept ids
}

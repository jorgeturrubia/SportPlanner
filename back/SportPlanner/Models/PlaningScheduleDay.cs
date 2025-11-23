namespace SportPlanner.Models;

public class PlaningScheduleDay
{
    public int Id { get; set; }
    public int PlanningId { get; set; }
    public Planning? Planning { get; set; }

    public DayOfWeek DayOfWeek { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan? EndTime { get; set; }
    public int? CourtId { get; set; }
    public Court? Court { get; set; }
}

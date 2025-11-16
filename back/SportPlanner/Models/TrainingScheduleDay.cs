namespace SportPlanner.Models;

public class TrainingScheduleDay
{
    public int Id { get; set; }
    public int TrainingScheduleId { get; set; }
    public TrainingSchedule? TrainingSchedule { get; set; }

    public DayOfWeek DayOfWeek { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan? EndTime { get; set; }
    public int? CourtId { get; set; }
    public Court? Court { get; set; }
}

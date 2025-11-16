namespace SportPlanner.Models;

public class TrainingSession
{
    public int Id { get; set; }
    public int? TrainingScheduleId { get; set; }
    public TrainingSchedule? TrainingSchedule { get; set; }

    public DateTime StartAt { get; set; }
    public TimeSpan Duration { get; set; }
    public int? CourtId { get; set; }
    public Court? Court { get; set; }

    public ICollection<SessionConcept> SessionConcepts { get; set; } = new List<SessionConcept>();
}

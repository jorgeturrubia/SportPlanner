using SportPlanner.Application.DTOs.Team;
using SportPlanner.Models;

namespace SportPlanner.Application.DTOs.Planning
{
    public class PlanningDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public TeamDto? Team { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public ICollection<PlaningScheduleDay> ScheduleDays { get; set; } = new List<PlaningScheduleDay>();
        public ICollection<PlanConceptDto> PlanConcepts { get; set; } = new List<PlanConceptDto>();
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}

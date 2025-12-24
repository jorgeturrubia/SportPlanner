namespace SportPlanner.Application.DTOs.Team
{
    using SportPlanner.Application.DTOs;

    public class TeamDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public TeamCategoryDto? TeamCategory { get; set; }
        public int? TeamLevelId { get; set; }
        public TeamLevelDto? TeamLevel { get; set; }
        public int CurrentTechnicalLevel { get; set; }
        public int CurrentTacticalLevel { get; set; }
        public string? PhotoUrl { get; set; }
    }
}

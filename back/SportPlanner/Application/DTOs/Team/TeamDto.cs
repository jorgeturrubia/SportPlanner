namespace SportPlanner.Application.DTOs.Team
{
    public class TeamDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public TeamCategoryDto? TeamCategory { get; set; }
    }
}

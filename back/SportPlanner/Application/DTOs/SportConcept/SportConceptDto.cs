namespace SportPlanner.Application.DTOs.SportConcept
{
    public class SportConceptDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public DifficultyLevelDto? DifficultyLevel { get; set; }
    }
}

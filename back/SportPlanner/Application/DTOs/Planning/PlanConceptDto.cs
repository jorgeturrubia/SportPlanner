using SportPlanner.Application.DTOs.SportConcept;

namespace SportPlanner.Application.DTOs.Planning
{
    public class PlanConceptDto
    {
        public int Id { get; set; }
        public int PlanningId { get; set; }
        public SportConceptDto? SportConcept { get; set; }
        public int Order { get; set; }
    }
}

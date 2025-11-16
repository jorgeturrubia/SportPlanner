namespace SportPlanner.Application.DTOs;

public class ConceptProposalDto
{
    public SportConceptDto Concept { get; set; } = null!;
    public decimal Score { get; set; }
    public bool IsSuggested { get; set; }
}

namespace SportPlanner.Application.DTOs.Proposal;

/// <summary>
/// Request DTO for generating concept proposals for a team
/// </summary>
public class ConceptProposalRequestDto
{
    /// <summary>ID of the team to generate proposals for</summary>
    public int TeamId { get; set; }

    /// <summary>ID of the season (required to determine team level)</summary>
    public int SeasonId { get; set; }

    /// <summary>Duration of the planning in days (optional, affects number of concepts)</summary>
    public int? DurationDays { get; set; }

    /// <summary>Maximum number of concepts to propose (optional)</summary>
    public int? MaxConcepts { get; set; }

    /// <summary>Category IDs to exclude from proposals (optional)</summary>
    public List<int>? ExcludeCategoryIds { get; set; }

    /// <summary>Concept IDs to explicitly include regardless of filters</summary>
    public List<int>? IncludeConceptIds { get; set; }

    /// <summary>Focus on specific sections: "Ataque", "Defensa", or null for both</summary>
    public string? SectionFocus { get; set; }

    /// <summary>Offset to adjust the difficulty window (e.g., -1 for reinforcement, +1 for aspirational)</summary>
    public int LevelOffset { get; set; } = 0;

    /// <summary>Specific Template ID to use (overrides Team's default)</summary>
    public int? PlanningTemplateId { get; set; }

    /// <summary>If true, disables the development level filtering</summary>
    public bool SkipLevelFilter { get; set; }
}

using SportPlanner.Enums;

namespace SportPlanner.Application.DTOs.Proposal;

/// <summary>
/// Response DTO containing generated concept proposals grouped by category
/// </summary>
public class ConceptProposalResponseDto
{
    /// <summary>Team information for context</summary>
    public TeamDto Team { get; set; } = null!;
    
    /// <summary>Suggested concept groups (score >= 0.7)</summary>
    public List<ConceptProposalGroupDto> SuggestedGroups { get; set; } = new();
    
    /// <summary>Optional concept groups (score 0.4-0.7)</summary>
    public List<ConceptProposalGroupDto> OptionalGroups { get; set; } = new();
    
    /// <summary>Metadata about the proposal generation</summary>
    public ProposalMetadataDto Metadata { get; set; } = null!;
}

/// <summary>
/// Group of concepts within a category
/// </summary>
public class ConceptProposalGroupDto
{
    /// <summary>Name of the category (e.g., "Técnica Individual > Cambios Dirección")</summary>
    public string CategoryName { get; set; } = null!;
    
    /// <summary>ID of the category</summary>
    public int CategoryId { get; set; }
    
    /// <summary>Section: "Ataque" or "Defensa"</summary>
    public string Section { get; set; } = null!;
    
    /// <summary>Scored concepts in this group</summary>
    public List<ScoredConceptDto> Concepts { get; set; } = new();
}

/// <summary>
/// A concept with its calculated score and reasoning
/// </summary>
public class ScoredConceptDto
{
    /// <summary>The sport concept details</summary>
    public SportConceptDto Concept { get; set; } = null!;
    
    /// <summary>Calculated match score (0.0 - 1.0)</summary>
    public decimal Score { get; set; }
    
    /// <summary>Human-readable reason for the score</summary>
    public string ScoreReason { get; set; } = null!;
    
    /// <summary>Priority classification</summary>
    public ProposalPriority Priority { get; set; }
    
    /// <summary>Tag indicating concept's relationship to team's itinerary</summary>
    public ConceptTag Tag { get; set; }
}

/// <summary>
/// Metadata about the proposal generation process
/// </summary>
public class ProposalMetadataDto
{
    /// <summary>Total concepts available in the system</summary>
    public int TotalAvailableConcepts { get; set; }
    
    /// <summary>Number of concepts in suggested groups</summary>
    public int SuggestedCount { get; set; }
    
    /// <summary>Number of concepts in optional groups</summary>
    public int OptionalCount { get; set; }
    
    /// <summary>Average match score across all evaluated concepts</summary>
    public decimal AverageTeamMatchScore { get; set; }
    
    /// <summary>Team's expected development level based on category</summary>
    public int ExpectedDevelopmentLevel { get; set; }
    
    /// <summary>Minimum development level in the concept window</summary>
    public int MinLevelWindow { get; set; }
    
    /// <summary>Maximum development level in the concept window</summary>
    public int MaxLevelWindow { get; set; }
    
    /// <summary>Number of concepts after filtering by level window</summary>
    public int FilteredConceptsCount { get; set; }
}

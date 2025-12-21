namespace SportPlanner.Enums;

/// <summary>
/// Tag indicating the relationship of a concept to a team's itinerary
/// </summary>
public enum ConceptTag
{
    /// <summary>Concept belongs to the team's current itinerary level</summary>
    Own = 1,
    
    /// <summary>Concept is from a previous stage and should be consolidated</summary>
    Inherited = 2,
    
    /// <summary>Concept is from a previous stage and needs reinforcement (for lower level teams)</summary>
    Reinforcement = 3,
    
    /// <summary>Concept is from a higher stage (for advanced teams)</summary>
    Aspirational = 4
}

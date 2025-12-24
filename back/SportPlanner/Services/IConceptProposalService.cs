using SportPlanner.Application.DTOs.Proposal;

namespace SportPlanner.Services;

/// <summary>
/// Service for generating intelligent concept proposals based on team characteristics
/// </summary>
public interface IConceptProposalService
{
    /// <summary>
    /// Generate concept proposals based on the provided request parameters
    /// </summary>
    /// <param name="request">Request containing team ID and optional filters</param>
    /// <returns>Response with suggested and optional concept groups</returns>
    Task<ConceptProposalResponseDto> GenerateProposalsAsync(ConceptProposalRequestDto request);

    /// <summary>
    /// Get concept proposals for a team with default parameters
    /// </summary>
    /// <param name="teamId">ID of the team</param>
    /// <param name="durationDays">Optional duration in days</param>
    /// <returns>Response with suggested and optional concept groups</returns>
    Task<ConceptProposalResponseDto?> GetProposalsForTeamAsync(int teamId, int seasonId, int? durationDays = null);
}

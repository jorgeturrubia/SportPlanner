using Microsoft.AspNetCore.Mvc;
using SportPlanner.Application.DTOs.Proposal;
using SportPlanner.Services;

namespace SportPlanner.Controllers;

/// <summary>
/// Controller for generating intelligent concept proposals based on team characteristics
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ConceptProposalsController : ControllerBase
{
    private readonly IConceptProposalService _proposalService;

    public ConceptProposalsController(IConceptProposalService proposalService)
    {
        _proposalService = proposalService;
    }

    /// <summary>
    /// Generate concept proposals based on request parameters
    /// </summary>
    /// <param name="request">Request with team ID and optional filters</param>
    /// <returns>Suggested and optional concept groups</returns>
    [HttpPost("generate")]
    public async Task<ActionResult<ConceptProposalResponseDto>> Generate(
        [FromBody] ConceptProposalRequestDto request)
    {
        try
        {
            var result = await _proposalService.GenerateProposalsAsync(request);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Get concept proposals for a specific team
    /// </summary>
    /// <param name="teamId">ID of the team</param>
    /// <param name="durationDays">Optional duration in days</param>
    /// <returns>Suggested and optional concept groups</returns>
    [HttpGet("team/{teamId}")]
    public async Task<ActionResult<ConceptProposalResponseDto>> GetForTeam(
        int teamId, 
        [FromQuery] int? durationDays = null)
    {
        var result = await _proposalService.GetProposalsForTeamAsync(teamId, durationDays);
        
        if (result == null)
        {
            return NotFound(new { message = $"Team with ID {teamId} not found" });
        }
        
        return Ok(result);
    }
}

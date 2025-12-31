using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SportPlanner.Application.DTOs;
using SportPlanner.Models;
using SportPlanner.Services;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SportPlanner.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class MarketplaceController : ControllerBase
{
    private readonly IMarketplaceService _marketplaceService;
    private readonly IPlanningTemplateService _planningTemplateService;
    private readonly IRatingService _ratingService;
    private readonly ICloningService _cloningService;
    private readonly IMapper _mapper;

    public MarketplaceController(
        IMarketplaceService marketplaceService,
        IPlanningTemplateService planningTemplateService,
        IRatingService ratingService,
        ICloningService cloningService,
        IMapper mapper)
    {
        _marketplaceService = marketplaceService;
        _planningTemplateService = planningTemplateService;
        _ratingService = ratingService;
        _cloningService = cloningService;
        _mapper = mapper;
    }

    protected string UserId => User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                            ?? User.FindFirst("sub")?.Value 
                            ?? throw new UnauthorizedAccessException();

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MarketplaceItemDto>>> Search([FromQuery] MarketplaceFilterDto filter)
    {
        var results = await _marketplaceService.SearchAsync(filter, UserId);
        return Ok(results);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ItineraryDetailDto>> GetDetail(int id)
    {
        var detail = await _marketplaceService.GetItineraryDetailAsync(id);
        if (detail == null) return NotFound();
        return Ok(detail);
    }

    [HttpGet("template/{id}")]
    public async Task<ActionResult<TemplateDetailDto>> GetTemplateDetail(int id)
    {
        var detail = await _marketplaceService.GetTemplateDetailAsync(id);
        if (detail == null) return NotFound();
        return Ok(detail);
    }

    [HttpPost("download/{id}")]
    public async Task<ActionResult<IEnumerable<PlanningTemplateSimpleDto>>> Download(int id)
    {
        try
        {
            var result = await _cloningService.CloneItineraryAsync(id, UserId);
            
            // Re-load templates if needed, or ensure CloningService returns them
            // For now, let's assume we want to return the templates of the newly cloned itinerary
            var templates = await _planningTemplateService.GetUserTemplatesAsync(UserId);
            var itineraryTemplates = templates.Where(t => t.MethodologicalItineraryId == result.Id).ToList();

            var dtos = _mapper.Map<List<PlanningTemplateSimpleDto>>(itineraryTemplates);
            return Ok(dtos);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Clones a system concept to the user's private space.
    /// </summary>
    [HttpPost("clone/concept/{id}")]
    public async Task<ActionResult<SportConceptDto>> CloneConcept(int id)
    {
        try
        {
            var cloned = await _cloningService.CloneConceptAsync(id, UserId);
            var dto = _mapper.Map<SportConceptDto>(cloned);
            return Ok(dto);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    /// <summary>
    /// Clones a system category to the user's private space.
    /// </summary>
    [HttpPost("clone/category/{id}")]
    public async Task<ActionResult<ConceptCategoryDto>> CloneCategory(int id)
    {
        try
        {
            var cloned = await _cloningService.CloneCategoryAsync(id, UserId);
            var dto = _mapper.Map<ConceptCategoryDto>(cloned);
            return Ok(dto);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    /// <summary>
    /// Clones a system template to the user's private space.
    /// </summary>
    [HttpPost("clone/template/{id}")]
    public async Task<ActionResult<PlanningTemplateSimpleDto>> CloneTemplate(int id)
    {
        try
        {
            var cloned = await _cloningService.CloneTemplateAsync(id, UserId);
            var dto = _mapper.Map<PlanningTemplateSimpleDto>(cloned);
            return Ok(dto);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpPost("rate")]
    public async Task<IActionResult> Rate([FromBody] RateItineraryRequest request)
    {
        var success = await _ratingService.RateItineraryAsync(request.ItineraryId, UserId, request.Rating);
        if (!success) return BadRequest("Invalid rating or itinerary not found.");
        return Ok();
    }

    [HttpGet("my-rating/{itineraryId}")]
    public async Task<ActionResult<int?>> GetMyRating(int itineraryId)
    {
        var rating = await _ratingService.GetUserRatingAsync(itineraryId, UserId);
        return Ok(rating);
    }

    [Authorize(Roles = SportPlanner.Models.UserRoles.AdminOwner)]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _marketplaceService.DeleteSystemItineraryAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }
}

public class RateItineraryRequest
{
    public int ItineraryId { get; set; }
    public int Rating { get; set; }
}

using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportPlanner.Application.DTOs;
using SportPlanner.Data;

namespace SportPlanner.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LookupsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;

    public LookupsController(AppDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    [HttpGet("team-levels")]
    public async Task<IActionResult> GetTeamLevels()
    {
        var levels = await _db.TeamLevels.Where(l => l.IsActive).OrderBy(l => l.Rank).ToListAsync();
        var dtos = _mapper.Map<List<TeamLevelDto>>(levels);
        return Ok(dtos);
    }

    [HttpGet("team-categories")]
    public async Task<IActionResult> GetTeamCategories()
    {
        var cats = await _db.TeamCategories.Where(c => c.IsActive).OrderBy(c => c.MinAge).ToListAsync();
        var dtos = _mapper.Map<List<TeamCategoryDto>>(cats);
        return Ok(dtos);
    }
}

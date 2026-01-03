using Microsoft.AspNetCore.Mvc;
using SportPlanner.Application.DTOs;
using SportPlanner.Services;
using AutoMapper;

namespace SportPlanner.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TacticalBoardsController : ControllerBase
{
    private readonly ITacticalBoardService _tacticalBoardService;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUser;

    public TacticalBoardsController(
        ITacticalBoardService tacticalBoardService,
        IMapper mapper,
        ICurrentUserService currentUser)
    {
        _tacticalBoardService = tacticalBoardService;
        _mapper = mapper;
        _currentUser = currentUser;
    }

    [HttpGet]
    public async Task<ActionResult<List<TacticalBoardDto>>> GetAll([FromQuery] int? exerciseId)
    {
        var boards = await _tacticalBoardService.GetAllAsync(exerciseId, _currentUser.UserId);
        return Ok(_mapper.Map<List<TacticalBoardDto>>(boards));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TacticalBoardDto>> GetById(int id)
    {
        var board = await _tacticalBoardService.GetByIdAsync(id);
        if (board == null) return NotFound();
        return Ok(_mapper.Map<TacticalBoardDto>(board));
    }

    [HttpPost]
    public async Task<ActionResult<TacticalBoardDto>> Create(CreateTacticalBoardDto dto)
    {
        // Assign ownership to current user
        dto.OwnerId = _currentUser.UserId;

        var board = await _tacticalBoardService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = board.Id }, _mapper.Map<TacticalBoardDto>(board));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TacticalBoardDto>> Update(int id, UpdateTacticalBoardDto dto)
    {
        try
        {
            var board = await _tacticalBoardService.UpdateAsync(id, dto);
            return Ok(_mapper.Map<TacticalBoardDto>(board));
        }
        catch (ArgumentException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _tacticalBoardService.DeleteAsync(id);
        return NoContent();
    }
}

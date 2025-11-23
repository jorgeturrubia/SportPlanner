using Microsoft.AspNetCore.Mvc;
using SportPlanner.Application.DTOs.Planning;
using SportPlanner.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SportPlanner.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlanningsController : ControllerBase
    {
        private readonly IPlanningService _planningService;

        public PlanningsController(IPlanningService planningService)
        {
            _planningService = planningService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PlanningDto>>> GetPlannings()
        {
            return Ok(await _planningService.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PlanningDto>> GetPlanning(int id)
        {
            var planning = await _planningService.GetByIdAsync(id);

            if (planning == null)
            {
                return NotFound();
            }

            return Ok(planning);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutPlanning(int id, UpdatePlanningDto updatePlanningDto)
        {
            var updatedPlanning = await _planningService.UpdateAsync(id, updatePlanningDto);

            if (updatedPlanning == null)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<PlanningDto>> PostPlanning(CreatePlanningDto createPlanningDto)
        {
            var createdPlanning = await _planningService.CreateAsync(createPlanningDto);
            return CreatedAtAction(nameof(GetPlanning), new { id = createdPlanning.Id }, createdPlanning);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePlanning(int id)
        {
            var result = await _planningService.DeleteAsync(id);
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}

using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SportPlanner.Application.DTOs.Planning;
using SportPlanner.Data;
using SportPlanner.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SportPlanner.Services
{
    public class PlanningService : IPlanningService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public PlanningService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<PlanningDto> CreateAsync(CreatePlanningDto createPlanningDto)
        {
            // Ensure DateTime fields are treated as UTC to satisfy PostgreSQL timestamp with time zone requirements
            createPlanningDto.StartDate = DateTime.SpecifyKind(createPlanningDto.StartDate, DateTimeKind.Utc);
            createPlanningDto.EndDate = DateTime.SpecifyKind(createPlanningDto.EndDate, DateTimeKind.Utc);
            var planning = _mapper.Map<Planning>(createPlanningDto);
            // Explicitly set UTC kind on the entity as well (in case mapping does not preserve it)
            planning.StartDate = DateTime.SpecifyKind(planning.StartDate, DateTimeKind.Utc);
            planning.EndDate = DateTime.SpecifyKind(planning.EndDate, DateTimeKind.Utc);
            _context.Plannings.Add(planning);
            await _context.SaveChangesAsync();
            return _mapper.Map<PlanningDto>(planning);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var planning = await _context.Plannings.FindAsync(id);
            if (planning == null)
            {
                return false;
            }

            _context.Plannings.Remove(planning);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<PlanningDto>> GetAllAsync()
        {
            var plannings = await _context.Plannings
                .Include(p => p.Team).ThenInclude(t => t.TeamCategory)
                .Include(p => p.ScheduleDays)
                .Include(p => p.PlanConcepts)
                    .ThenInclude(pc => pc.SportConcept)
                        .ThenInclude(sc => sc.DifficultyLevel)
                .Include(p => p.PlanConcepts)
                    .ThenInclude(pc => pc.SportConcept)
                        .ThenInclude(sc => sc.ConceptCategory)
                            .ThenInclude(cc => cc.Parent)
                .ToListAsync();
            return _mapper.Map<IEnumerable<PlanningDto>>(plannings);
        }

        public async Task<PlanningDto?> GetByIdAsync(int id)
        {
            var planning = await _context.Plannings
                .Include(p => p.Team).ThenInclude(t => t.TeamCategory)
                .Include(p => p.ScheduleDays)
                .Include(p => p.PlanConcepts)
                    .ThenInclude(pc => pc.SportConcept)
                        .ThenInclude(sc => sc.DifficultyLevel)
                .Include(p => p.PlanConcepts)
                    .ThenInclude(pc => pc.SportConcept)
                        .ThenInclude(sc => sc.ConceptCategory)
                            .ThenInclude(cc => cc.Parent)
                .FirstOrDefaultAsync(p => p.Id == id);
            
            return _mapper.Map<PlanningDto>(planning);
        }

        public async Task<PlanningDto?> UpdateAsync(int id, UpdatePlanningDto updatePlanningDto)
        {
            var planning = await _context.Plannings.FindAsync(id);
            if (planning == null)
            {
                return null;
            }

            // Ensure any DateTime fields in the DTO are UTC before mapping
            if (updatePlanningDto.StartDate.HasValue)
                updatePlanningDto.StartDate = DateTime.SpecifyKind(updatePlanningDto.StartDate.Value, DateTimeKind.Utc);
            if (updatePlanningDto.EndDate.HasValue)
                updatePlanningDto.EndDate = DateTime.SpecifyKind(updatePlanningDto.EndDate.Value, DateTimeKind.Utc);

            _mapper.Map(updatePlanningDto, planning);
            // Ensure the entity's DateTime kinds are UTC as well
            planning.StartDate = DateTime.SpecifyKind(planning.StartDate, DateTimeKind.Utc);
            planning.EndDate = DateTime.SpecifyKind(planning.EndDate, DateTimeKind.Utc);
            _context.Entry(planning).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PlanningExists(id))
                {
                    return null;
                }
                else
                {
                    throw;
                }
            }

            return _mapper.Map<PlanningDto>(planning);
        }

        private bool PlanningExists(int id)
        {
            return _context.Plannings.Any(e => e.Id == id);
        }
    }
}

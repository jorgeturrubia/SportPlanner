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
    public class PlanningService(AppDbContext context, IMapper mapper) : IPlanningService
    {
        private readonly AppDbContext _context = context;
        private readonly IMapper _mapper = mapper;

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

        public async Task<IEnumerable<PlanningDto>> GetAllAsync(int? teamId = null, int? seasonId = null)
        {
            var query = _context.Plannings
                .Include(p => p.Team).ThenInclude(t => t!.TeamSeasons).ThenInclude(ts => ts.TeamCategory)
                .Include(p => p.ScheduleDays)
                .Include(p => p.PlanConcepts)
                    .ThenInclude(pc => pc.SportConcept)
                        .ThenInclude(sc => sc!.ConceptCategory)
                .AsQueryable();

            if (teamId.HasValue)
            {
                query = query.Where(p => p.TeamId == teamId.Value);
            }

            if (seasonId.HasValue)
            {
                query = query.Where(p => p.SeasonId == seasonId.Value);
            }

            var plannings = await query.ToListAsync();

            await ReconstructCategories(plannings.SelectMany(p => p.PlanConcepts).Select(pc => pc.SportConcept));

            return _mapper.Map<IEnumerable<PlanningDto>>(plannings);
        }

        public async Task<PlanningDto?> GetByIdAsync(int id)
        {
            var planning = await _context.Plannings
                .Include(p => p.Team).ThenInclude(t => t!.TeamSeasons).ThenInclude(ts => ts.TeamCategory)
                .Include(p => p.ScheduleDays)
                .Include(p => p.PlanConcepts)
                    .ThenInclude(pc => pc.SportConcept)
                        .ThenInclude(sc => sc!.ConceptCategory)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (planning != null)
            {
                await ReconstructCategories(planning.PlanConcepts.Select(pc => pc.SportConcept));
            }

            return _mapper.Map<PlanningDto>(planning);
        }

        private async Task ReconstructCategories(IEnumerable<SportConcept?> concepts)
        {
            var allCategories = await _context.ConceptCategories
                .Where(c => c.IsActive)
                .ToListAsync();

            var categoryMap = allCategories.ToDictionary(c => c.Id);

            foreach (var concept in concepts)
            {
                if (concept?.ConceptCategory != null && concept.ConceptCategory.ParentId.HasValue)
                {
                    var current = concept.ConceptCategory;
                    while (current.ParentId.HasValue && categoryMap.ContainsKey(current.ParentId.Value))
                    {
                        current.Parent = categoryMap[current.ParentId.Value];
                        current = current.Parent;
                    }
                }
            }
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

        public async Task<PlanMonitorDto?> GetPlanMonitorAsync(int planningId)
        {
            var planning = await _context.Plannings
                .Include(p => p.Team)
                .Include(p => p.PlanConcepts)
                    .ThenInclude(pc => pc.SportConcept)
                        .ThenInclude(sc => sc!.ConceptCategory)
                .FirstOrDefaultAsync(p => p.Id == planningId);

            if (planning == null) return null;

            // Fetch training sessions for the team in the planning period
            // Assumption: Monitor all sessions for the team, or just those within range?
            // Usually planning covers a specific range. Let's use range.
            // Also need to include concepts used in sessions.
            var sessions = await _context.TrainingSessions
                .Where(t => t.TeamId == planning.TeamId && t.Date >= planning.StartDate && t.Date <= planning.EndDate)
                .Include(t => t.SessionConcepts)
                    .ThenInclude(sc => sc.SportConcept)
                        .ThenInclude(c => c!.ConceptCategory)
                .Include(t => t.SessionExercises)
                    .ThenInclude(se => se.SportConcept)
                        .ThenInclude(c => c!.ConceptCategory)
                .OrderBy(t => t.Date)
                .ToListAsync();

            var resp = new PlanMonitorDto
            {
                PlanningId = planning.Id,
                PlanningName = planning.Name ?? "Sin Nombre",
                Sessions = [.. sessions.Select(s => new PlanMonitorSessionDto
                {
                    Id = s.Id,
                    Date = s.Date,
                    Name = s.Name ?? "Entrenamiento"
                })]
            };

            // Gather all Unique Concepts (Planned + Used)
            var plannedConceptIds = planning.PlanConcepts.Select(pc => pc.SportConceptId).ToHashSet();

            // Map ConceptId -> SportConcept Entity (to access name/category)
            var conceptMap = new Dictionary<int, SportConcept>();

            // 1. Add Planned Concepts
            foreach (var pc in planning.PlanConcepts)
            {
                if (pc.SportConcept != null && !conceptMap.ContainsKey(pc.SportConceptId))
                {
                    conceptMap[pc.SportConceptId] = pc.SportConcept;
                }
            }

            // 2. Add Used Concepts (from SessionConcepts and SessionExercises)
            foreach (var s in sessions)
            {
                foreach (var sc in s.SessionConcepts)
                {
                    if (sc.SportConcept != null && !conceptMap.ContainsKey(sc.SportConceptId))
                    {
                        conceptMap[sc.SportConceptId] = sc.SportConcept;
                    }
                }
                foreach (var se in s.SessionExercises)
                {
                    if (se.SportConceptId.HasValue && se.SportConcept != null && !conceptMap.ContainsKey(se.SportConceptId.Value))
                    {
                        conceptMap[se.SportConceptId.Value] = se.SportConcept;
                    }
                }
            }

            // Reconstruct parents for all categories involved
            await ReconstructCategories(conceptMap.Values);

            // Group by Category
            var categoryGroups = conceptMap.Values
                .GroupBy(c => c.ConceptCategoryId) // This groups by leaf category
                .ToList();

            // 1. Get all unique categories from the concepts involved
            var categoriesList = conceptMap.Values
                .Where(c => c.ConceptCategory != null)
                .Select(c => c.ConceptCategory!)
                .GroupBy(c => c.Id)
                .Select(g => g.First())
                .ToList();

            // 2. Process Categorized Concepts
            foreach (var cat in categoriesList.OrderBy(c => GetFullCategoryName(c)))
            {
                var catDto = new PlanMonitorCategoryDto
                {
                    CategoryId = cat.Id,
                    CategoryName = GetFullCategoryName(cat)
                };

                // Find concepts in this EXACT leaf category
                var conceptsInCat = conceptMap.Values
                    .Where(c => c.ConceptCategoryId == cat.Id)
                    .OrderBy(c => c.Name);

                foreach (var c in conceptsInCat)
                {
                    catDto.Concepts.Add(CreateConceptDto(c, plannedConceptIds, sessions));
                }

                if (catDto.Concepts.Count > 0)
                {
                    resp.Categories.Add(catDto);
                }
            }

            // 3. Handle concepts with no category
            var uncategorizedConcepts = conceptMap.Values
                .Where(c => c.ConceptCategoryId == null)
                .OrderBy(c => c.Name)
                .ToList();

            if (uncategorizedConcepts.Count > 0)
            {
                var uncategorizedDto = new PlanMonitorCategoryDto
                {
                    CategoryId = 0,
                    CategoryName = "Sin Categoría"
                };

                foreach (var c in uncategorizedConcepts)
                {
                    uncategorizedDto.Concepts.Add(CreateConceptDto(c, plannedConceptIds, sessions));
                }
                resp.Categories.Add(uncategorizedDto);
            }

            return resp;
        }

        private static string GetFullCategoryName(ConceptCategory? category)
        {
            if (category == null) return "Sin Categoría";
            var names = new List<string>();
            var current = category;
            while (current != null)
            {
                names.Insert(0, current.Name);
                current = current.Parent;
            }
            return string.Join(" > ", names);
        }

        private static PlanMonitorConceptDto CreateConceptDto(SportConcept c, HashSet<int> plannedConceptIds, List<TrainingSession> sessions)
        {
            var cDto = new PlanMonitorConceptDto
            {
                ConceptId = c.Id,
                ConceptName = c.Name,
                IsPlanned = plannedConceptIds.Contains(c.Id),
                Executions = []
            };

            foreach (var s in sessions)
            {
                var fromConcepts = s.SessionConcepts.Where(sc => sc.SportConceptId == c.Id).ToList();
                var fromExercises = s.SessionExercises.Where(se => se.SportConceptId == c.Id).ToList();

                if (fromConcepts.Count > 0 || fromExercises.Count > 0)
                {
                    cDto.Executions.Add(new PlanMonitorExecutionDto
                    {
                        TrainingSessionId = s.Id,
                        Count = fromConcepts.Count + fromExercises.Count,
                        DurationMinutes = fromConcepts.Sum(x => x.DurationMinutes ?? 0) + fromExercises.Sum(x => x.DurationMinutes ?? 0)
                    });
                }
            }
            return cDto;
        }
    }
}

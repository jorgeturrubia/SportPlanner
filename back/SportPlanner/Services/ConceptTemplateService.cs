using Microsoft.EntityFrameworkCore;
using AutoMapper;
using SportPlanner.Application.DTOs.ConceptTemplate;
using SportPlanner.Data;
using SportPlanner.Models;

namespace SportPlanner.Services;

public interface IConceptTemplateService
{
    Task<List<ConceptTemplateResponseDto>> GetAllAsync(int? sportId = null);
    Task<ConceptTemplateResponseDto?> GetByIdAsync(int id);
    Task<ConceptTemplateResponseDto> CreateAsync(ConceptTemplateCreateDto dto);
    Task<ConceptTemplateResponseDto> UpdateAsync(int id, ConceptTemplateUpdateDto dto);
    Task DeleteAsync(int id);
}

public class ConceptTemplateService : IConceptTemplateService
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;

    public ConceptTemplateService(AppDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    public async Task<List<ConceptTemplateResponseDto>> GetAllAsync(int? sportId = null)
    {
        var query = _db.ConceptTemplates
            .Include(ct => ct.Sport)
            .Include(ct => ct.ConceptCategory)
            .Where(ct => ct.IsActive);

        if (sportId.HasValue)
        {
            query = query.Where(ct => ct.SportId == sportId);
        }

        var templates = await query
            .OrderBy(ct => ct.TechnicalComplexity)
            .ThenBy(ct => ct.TacticalComplexity)
            .ThenBy(ct => ct.Name)
            .ToListAsync();

        return _mapper.Map<List<ConceptTemplateResponseDto>>(templates);
    }

    public async Task<ConceptTemplateResponseDto?> GetByIdAsync(int id)
    {
        var template = await _db.ConceptTemplates
            .Include(ct => ct.Sport)
            .Include(ct => ct.ConceptCategory)
            .FirstOrDefaultAsync(ct => ct.Id == id);

        return template != null ? _mapper.Map<ConceptTemplateResponseDto>(template) : null;
    }

    public async Task<ConceptTemplateResponseDto> CreateAsync(ConceptTemplateCreateDto dto)
    {
        // Check for duplicate name within the same sport
        var exists = await _db.ConceptTemplates
            .AnyAsync(ct => ct.Name == dto.Name && ct.SportId == dto.SportId && ct.IsActive);

        if (exists)
        {
            throw new InvalidOperationException($"A template with name '{dto.Name}' already exists for this sport.");
        }

        var template = _mapper.Map<ConceptTemplate>(dto);
        _db.ConceptTemplates.Add(template);
        await _db.SaveChangesAsync();

        // Reload with navigation properties
        await _db.Entry(template).Reference(t => t.Sport).LoadAsync();
        await _db.Entry(template).Reference(t => t.ConceptCategory).LoadAsync();

        return _mapper.Map<ConceptTemplateResponseDto>(template);
    }

    public async Task<ConceptTemplateResponseDto> UpdateAsync(int id, ConceptTemplateUpdateDto dto)
    {
        var template = await _db.ConceptTemplates
            .Include(ct => ct.Sport)
            .Include(ct => ct.ConceptCategory)
            .FirstOrDefaultAsync(ct => ct.Id == id);

        if (template == null)
        {
            throw new ArgumentException("Template not found");
        }

        // Check for duplicate name if name is being changed
        if (!string.IsNullOrEmpty(dto.Name) && dto.Name != template.Name)
        {
            var exists = await _db.ConceptTemplates
                .AnyAsync(ct => ct.Name == dto.Name && ct.SportId == template.SportId && ct.IsActive && ct.Id != id);

            if (exists)
            {
                throw new InvalidOperationException($"A template with name '{dto.Name}' already exists for this sport.");
            }
        }

        _mapper.Map(dto, template);
        await _db.SaveChangesAsync();

        return _mapper.Map<ConceptTemplateResponseDto>(template);
    }

    public async Task DeleteAsync(int id)
    {
        var template = await _db.ConceptTemplates.FindAsync(id);
        if (template != null)
        {
            template.IsActive = false;
            await _db.SaveChangesAsync();
        }
    }
}

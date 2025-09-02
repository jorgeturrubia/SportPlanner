using Microsoft.EntityFrameworkCore;
using SportPlanner.Data;
using SportPlanner.Models;
using SportPlanner.DTOs;
using SportPlanner.Exceptions;
using SportPlanner.Interfaces;

namespace SportPlanner.Services;

public interface I[SERVICE_NAME]Service
{
    Task<IEnumerable<[ENTITY]Dto>> GetAllAsync(Guid userId);
    Task<[ENTITY]Dto?> GetByIdAsync(Guid id, Guid userId);
    Task<[ENTITY]Dto> CreateAsync([ENTITY]CreateDto dto, Guid userId);
    Task<[ENTITY]Dto> UpdateAsync(Guid id, [ENTITY]UpdateDto dto, Guid userId);
    Task<bool> DeleteAsync(Guid id, Guid userId);
}

public class [SERVICE_NAME]Service : I[SERVICE_NAME]Service
{
    private readonly SportPlannerContext _context;
    private readonly ILogger<[SERVICE_NAME]Service> _logger;

    public [SERVICE_NAME]Service(
        SportPlannerContext context,
        ILogger<[SERVICE_NAME]Service> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<IEnumerable<[ENTITY]Dto>> GetAllAsync(Guid userId)
    {
        try
        {
            var entities = await _context.[ENTITY_PLURAL]
                .Where(e => e.CreatedBy == userId) // Add appropriate filtering
                .Select(e => new [ENTITY]Dto
                {
                    Id = e.Id,
                    Name = e.Name,
                    CreatedDate = e.CreatedDate,
                    // Map other properties
                })
                .AsNoTracking()
                .ToListAsync();

            return entities;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving [ENTITY_PLURAL] for user {UserId}", userId);
            throw;
        }
    }

    public async Task<[ENTITY]Dto?> GetByIdAsync(Guid id, Guid userId)
    {
        try
        {
            var entity = await _context.[ENTITY_PLURAL]
                .Where(e => e.Id == id && e.CreatedBy == userId) // Add appropriate filtering
                .Select(e => new [ENTITY]Dto
                {
                    Id = e.Id,
                    Name = e.Name,
                    CreatedDate = e.CreatedDate,
                    // Map other properties
                })
                .AsNoTracking()
                .FirstOrDefaultAsync();

            return entity;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving [ENTITY] {Id} for user {UserId}", id, userId);
            throw;
        }
    }

    public async Task<[ENTITY]Dto> CreateAsync([ENTITY]CreateDto dto, Guid userId)
    {
        try
        {
            var entity = new [ENTITY]
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                CreatedBy = userId,
                CreatedDate = DateTime.UtcNow,
                // Map other properties from DTO
            };

            _context.[ENTITY_PLURAL].Add(entity);
            await _context.SaveChangesAsync();

            _logger.LogInformation("[ENTITY] {Id} created successfully by user {UserId}", entity.Id, userId);

            return new [ENTITY]Dto
            {
                Id = entity.Id,
                Name = entity.Name,
                CreatedDate = entity.CreatedDate,
                // Map other properties
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating [ENTITY] for user {UserId}", userId);
            throw;
        }
    }

    public async Task<[ENTITY]Dto> UpdateAsync(Guid id, [ENTITY]UpdateDto dto, Guid userId)
    {
        try
        {
            var entity = await _context.[ENTITY_PLURAL]
                .FirstOrDefaultAsync(e => e.Id == id && e.CreatedBy == userId);

            if (entity == null)
            {
                throw new NotFoundException($"[ENTITY] with ID {id} not found or not accessible");
            }

            // Update properties
            entity.Name = dto.Name;
            entity.LastModified = DateTime.UtcNow;
            // Update other properties from DTO

            await _context.SaveChangesAsync();

            _logger.LogInformation("[ENTITY] {Id} updated successfully by user {UserId}", id, userId);

            return new [ENTITY]Dto
            {
                Id = entity.Id,
                Name = entity.Name,
                CreatedDate = entity.CreatedDate,
                // Map other properties
            };
        }
        catch (NotFoundException)
        {
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating [ENTITY] {Id} for user {UserId}", id, userId);
            throw;
        }
    }

    public async Task<bool> DeleteAsync(Guid id, Guid userId)
    {
        try
        {
            var entity = await _context.[ENTITY_PLURAL]
                .FirstOrDefaultAsync(e => e.Id == id && e.CreatedBy == userId);

            if (entity == null)
            {
                return false;
            }

            _context.[ENTITY_PLURAL].Remove(entity);
            await _context.SaveChangesAsync();

            _logger.LogInformation("[ENTITY] {Id} deleted successfully by user {UserId}", id, userId);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting [ENTITY] {Id} for user {UserId}", id, userId);
            throw;
        }
    }
}

/* 
USAGE INSTRUCTIONS:
1. Replace [SERVICE_NAME] with the service name (e.g., 'Team')
2. Replace [ENTITY] with the entity name (e.g., 'Team')
3. Replace [ENTITY_PLURAL] with plural form (e.g., 'Teams')
4. Create corresponding DTOs ([ENTITY]Dto, [ENTITY]CreateDto, [ENTITY]UpdateDto)
5. Add appropriate Entity Framework relationships and includes
6. Implement business logic specific to your entity
7. Add validation logic as needed
8. Register service in Program.cs: builder.Services.AddScoped<I[SERVICE_NAME]Service, [SERVICE_NAME]Service>();

.NET 8 PATTERNS INCLUDED:
- Async/await with proper exception handling
- ILogger for structured logging
- Entity Framework Core with proper tracking
- Dependency injection ready
- DTO pattern for data transfer
- GUID-based entity identification
- User context filtering
- Custom exceptions for error handling
- Performance optimization with AsNoTracking()
- Proper resource disposal (handled by DI container)
*/
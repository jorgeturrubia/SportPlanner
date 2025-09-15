using Microsoft.EntityFrameworkCore;
using SportPlanner.Data;
using SportPlanner.Models;
using SportPlanner.Models.DTOs;

namespace SportPlanner.Services;

public class SubscriptionService : ISubscriptionService
{
    private readonly SportPlannerDbContext _context;
    private readonly ILogger<SubscriptionService> _logger;

    public SubscriptionService(SportPlannerDbContext context, ILogger<SubscriptionService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<UserSubscriptionStatusResponse> GetUserSubscriptionStatusAsync(Guid userId)
    {
        var subscriptions = await _context.UserSubscriptions
            .Include(us => us.Subscription)
            .Where(us => us.UserId == userId)
            .OrderByDescending(us => us.StartDate)
            .ToListAsync();

        var activeSubscription = subscriptions.FirstOrDefault(us => us.IsActive && 
            (!us.EndDate.HasValue || us.EndDate.Value > DateTime.UtcNow));

        return new UserSubscriptionStatusResponse
        {
            HasActiveSubscription = activeSubscription != null,
            ActiveSubscription = activeSubscription != null ? MapToSubscriptionResponse(activeSubscription) : null,
            AllSubscriptions = subscriptions.Select(MapToSubscriptionResponse).ToList()
        };
    }

    public async Task<List<AvailableSubscriptionResponse>> GetAvailableSubscriptionsAsync()
    {
        List<AvailableSubscriptionResponse> subscriptions = new List<AvailableSubscriptionResponse>();

        subscriptions = 
         await _context.Subscriptions
            .Where(s => s.IsActive)
            .Select(s => new AvailableSubscriptionResponse
            {
                Id = s.Id,
                Name = s.Name,
                Type = s.Type,
                Price = s.Price,
                Description = s.Description,
                MaxTeams = s.MaxTeams,
                MaxTrainingSessions = s.MaxTrainingSessions,
                CanCreateCustomConcepts = s.CanCreateCustomConcepts,
                CanCreateItineraries = s.CanCreateItineraries,
                HasDirectorMode = s.HasDirectorMode
            })
            .ToListAsync();

        return subscriptions;
    }

    public async Task<List<SportTypeResponse>> GetSportTypesAsync()
    {
        return Enum.GetValues<SportType>()
            .Select(st => new SportTypeResponse
            {
                SportType = st,
                Name = GetSportTypeName(st),
                Description = GetSportTypeDescription(st)
            })
            .ToList();
    }

    public async Task<SubscriptionResponse> CreateSubscriptionAsync(Guid userId, CreateSubscriptionRequest request)
    {
        // Verificar si ya existe una suscripción activa
        var existingActiveSubscription = await _context.UserSubscriptions
            .FirstOrDefaultAsync(us => us.UserId == userId && us.IsActive && 
                (!us.EndDate.HasValue || us.EndDate.Value > DateTime.UtcNow));

        if (existingActiveSubscription != null)
        {
            // Desactivar la suscripción existente
            existingActiveSubscription.IsActive = false;
            existingActiveSubscription.EndDate = DateTime.UtcNow;
        }

        // Verificar que el plan de suscripción existe
        var subscription = await _context.Subscriptions
            .FirstOrDefaultAsync(s => s.Id == request.SubscriptionId && s.IsActive);

        if (subscription == null)
        {
            throw new ArgumentException("Subscription plan not found or inactive");
        }

        var userSubscription = new UserSubscription
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            SubscriptionId = request.SubscriptionId,
            Sport = request.Sport,
            StartDate = DateTime.UtcNow,
            EndDate = request.EndDate,
            IsActive = true
        };

        _context.UserSubscriptions.Add(userSubscription);
        await _context.SaveChangesAsync();

        // Recargar con relaciones
        var createdSubscription = await _context.UserSubscriptions
            .Include(us => us.Subscription)
            .FirstAsync(us => us.Id == userSubscription.Id);

        return MapToSubscriptionResponse(createdSubscription);
    }

    public async Task<SubscriptionResponse?> UpdateSubscriptionAsync(Guid userId, Guid subscriptionId, UpdateSubscriptionRequest request)
    {
        var userSubscription = await _context.UserSubscriptions
            .Include(us => us.Subscription)
            .FirstOrDefaultAsync(us => us.Id == subscriptionId && us.UserId == userId);

        if (userSubscription == null)
        {
            return null;
        }

        // Verificar que el plan de suscripción existe
        var subscription = await _context.Subscriptions
            .FirstOrDefaultAsync(s => s.Id == request.SubscriptionId && s.IsActive);

        if (subscription == null)
        {
            throw new ArgumentException("Subscription plan not found or inactive");
        }

        userSubscription.SubscriptionId = request.SubscriptionId;
        userSubscription.Sport = request.Sport;
        userSubscription.EndDate = request.EndDate;
        userSubscription.IsActive = request.IsActive;

        await _context.SaveChangesAsync();

        return MapToSubscriptionResponse(userSubscription);
    }

    public async Task<bool> CancelSubscriptionAsync(Guid userId, Guid subscriptionId)
    {
        var userSubscription = await _context.UserSubscriptions
            .FirstOrDefaultAsync(us => us.Id == subscriptionId && us.UserId == userId && us.IsActive);

        if (userSubscription == null)
        {
            return false;
        }

        userSubscription.IsActive = false;
        userSubscription.EndDate = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<SubscriptionResponse?> GetSubscriptionByIdAsync(Guid userId, Guid subscriptionId)
    {
        var userSubscription = await _context.UserSubscriptions
            .Include(us => us.Subscription)
            .FirstOrDefaultAsync(us => us.Id == subscriptionId && us.UserId == userId);

        return userSubscription != null ? MapToSubscriptionResponse(userSubscription) : null;
    }

    public async Task<List<SubscriptionResponse>> GetUserSubscriptionsAsync(Guid userId)
    {
        return await _context.UserSubscriptions
            .Include(us => us.Subscription)
            .Where(us => us.UserId == userId)
            .OrderByDescending(us => us.StartDate)
            .Select(us => MapToSubscriptionResponse(us))
            .ToListAsync();
    }

    public async Task<bool> HasActiveSubscriptionAsync(Guid userId)
    {
        return await _context.UserSubscriptions
            .AnyAsync(us => us.UserId == userId && us.IsActive && 
                (!us.EndDate.HasValue || us.EndDate.Value > DateTime.UtcNow));
    }

    public async Task<bool> CanAccessDashboardAsync(Guid userId)
    {
        return await HasActiveSubscriptionAsync(userId);
    }

    private static SubscriptionResponse MapToSubscriptionResponse(UserSubscription userSubscription)
    {
        return new SubscriptionResponse
        {
            Id = userSubscription.Id,
            UserId = userSubscription.UserId,
            SubscriptionId = userSubscription.SubscriptionId,
            SubscriptionType = userSubscription.Subscription.Type,
            SubscriptionName = userSubscription.Subscription.Name,
            Sport = userSubscription.Sport,
            StartDate = userSubscription.StartDate,
            EndDate = userSubscription.EndDate,
            IsActive = userSubscription.IsActive,
            CreatedAt = userSubscription.StartDate,
            UpdatedAt = DateTime.UtcNow
        };
    }

    private static string GetSportTypeName(SportType sportType)
    {
        return sportType switch
        {
            SportType.Football => "Fútbol",
            SportType.Basketball => "Baloncesto",
            SportType.Tennis => "Tenis",
            SportType.Volleyball => "Voleibol",
            SportType.Rugby => "Rugby",
            SportType.Handball => "Balonmano",
            SportType.Hockey => "Hockey",
            SportType.Baseball => "Béisbol",
            SportType.Swimming => "Natación",
            SportType.Athletics => "Atletismo",
            SportType.Other => "Otro",
            _ => sportType.ToString()
        };
    }

    private static string GetSportTypeDescription(SportType sportType)
    {
        return sportType switch
        {
            SportType.Football => "Deporte de equipo jugado con los pies",
            SportType.Basketball => "Deporte de equipo jugado con las manos",
            SportType.Tennis => "Deporte de raqueta individual o por parejas",
            SportType.Volleyball => "Deporte de equipo con red",
            SportType.Rugby => "Deporte de contacto con oval",
            SportType.Handball => "Deporte de equipo en pista",
            SportType.Hockey => "Deporte con stick y puck",
            SportType.Baseball => "Deporte de bate y pelota",
            SportType.Swimming => "Deporte acuático competitivo",
            SportType.Athletics => "Deportes de pista y campo",
            SportType.Other => "Otros deportes",
            _ => "Descripción no disponible"
        };
    }
}

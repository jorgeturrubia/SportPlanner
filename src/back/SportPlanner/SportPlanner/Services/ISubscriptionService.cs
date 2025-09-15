using SportPlanner.Models.DTOs;

namespace SportPlanner.Services;

public interface ISubscriptionService
{
    Task<UserSubscriptionStatusResponse> GetUserSubscriptionStatusAsync(Guid userId);
    Task<List<AvailableSubscriptionResponse>> GetAvailableSubscriptionsAsync();
    Task<List<SportTypeResponse>> GetSportTypesAsync();
    Task<SubscriptionResponse> CreateSubscriptionAsync(Guid userId, CreateSubscriptionRequest request);
    Task<SubscriptionResponse?> UpdateSubscriptionAsync(Guid userId, Guid subscriptionId, UpdateSubscriptionRequest request);
    Task<bool> CancelSubscriptionAsync(Guid userId, Guid subscriptionId);
    Task<SubscriptionResponse?> GetSubscriptionByIdAsync(Guid userId, Guid subscriptionId);
    Task<List<SubscriptionResponse>> GetUserSubscriptionsAsync(Guid userId);
    Task<bool> HasActiveSubscriptionAsync(Guid userId);
    Task<bool> CanAccessDashboardAsync(Guid userId);
}

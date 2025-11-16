using System.Threading.Tasks;

namespace SportPlanner.Services;

public interface IBillingService
{
    Task<bool> CreateSubscriptionAsync(string? userSupabaseId, int? organizationId, int planId, int sportId);
    Task<bool> CancelSubscriptionAsync(int subscriptionId);
    Task<bool> ReactivateSubscriptionAsync(int subscriptionId);
}

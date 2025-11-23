using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace SportPlanner.Services;

public class BillingServiceStub : IBillingService
{
    private readonly ILogger<BillingServiceStub> _logger;
    public BillingServiceStub(ILogger<BillingServiceStub> logger)
    {
        _logger = logger;
    }

    public Task<bool> CreateSubscriptionAsync(string? userSupabaseId, int? organizationId, int planId, int sportId)
    {
        _logger.LogInformation("BillingServiceStub: CreateSubscription called for user {UserSupabaseId} org {OrgId} plan {PlanId} sport {SportId}", userSupabaseId, organizationId, planId, sportId);
        return Task.FromResult(true);
    }

    public Task<bool> CancelSubscriptionAsync(int subscriptionId)
    {
        _logger.LogInformation("BillingServiceStub: CancelSubscription called for subscription {SubscriptionId}", subscriptionId);
        return Task.FromResult(true);
    }

    public Task<bool> ReactivateSubscriptionAsync(int subscriptionId)
    {
        _logger.LogInformation("BillingServiceStub: ReactivateSubscription called for subscription {SubscriptionId}", subscriptionId);
        return Task.FromResult(true);
    }
}

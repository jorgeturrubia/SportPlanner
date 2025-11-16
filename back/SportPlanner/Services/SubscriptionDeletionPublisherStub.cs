using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace SportPlanner.Services;

public class SubscriptionDeletionPublisherStub : ISubscriptionDeletionPublisher
{
    private readonly ILogger<SubscriptionDeletionPublisherStub> _logger;
    public SubscriptionDeletionPublisherStub(ILogger<SubscriptionDeletionPublisherStub> logger)
    {
        _logger = logger;
    }

    public Task PublishDeletionRequestedAsync(int subscriptionId)
    {
        _logger.LogInformation("SubscriptionDeletionPublisherStub: publish deletion requested for subscription {SubscriptionId}", subscriptionId);
        return Task.CompletedTask;
    }
}

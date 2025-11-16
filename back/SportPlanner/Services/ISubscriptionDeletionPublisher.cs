using System.Threading.Tasks;

namespace SportPlanner.Services;

public interface ISubscriptionDeletionPublisher
{
    Task PublishDeletionRequestedAsync(int subscriptionId);
}

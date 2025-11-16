using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using SportPlanner.Data;
using SportPlanner.Models;

namespace SportPlanner.Services;

public class SubscriptionProcessingService : IHostedService, IDisposable
{
    private readonly ILogger<SubscriptionProcessingService> _logger;
    private readonly IServiceProvider _services;
    private Timer? _timer;

    public SubscriptionProcessingService(IServiceProvider services, ILogger<SubscriptionProcessingService> logger)
    {
        _services = services;
        _logger = logger;
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("SubscriptionProcessingService starting");
        _timer = new Timer(async _ => await DoWorkAsync(), null, TimeSpan.Zero, TimeSpan.FromMinutes(1));
        return Task.CompletedTask;
    }

    // Make the processing method public for testing purposes
    public async Task ProcessPendingChangesAsync()
    {
        await DoWorkAsync();
    }

    private async Task DoWorkAsync()
    {
        try
        {
            using var scope = _services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var publisher = scope.ServiceProvider.GetRequiredService<ISubscriptionDeletionPublisher>();

            // 1) Apply scheduled subscription history changes (downgrades/upgrades) with EffectiveAt <= now
            var pendings = await db.SubscriptionHistories
                .Where(h => h.EffectiveAt <= DateTime.UtcNow)
                .ToListAsync();
            foreach (var h in pendings)
            {
                var sub = await db.Subscriptions.FindAsync(h.SubscriptionId);
                if (sub == null) continue;
                if (h.ChangeType == SubscriptionChangeType.Downgrade || h.ChangeType == SubscriptionChangeType.Upgrade)
                {
                    if (h.NewPlanId.HasValue)
                    {
                        sub.PlanId = h.NewPlanId.Value;
                        sub.UpdatedAt = DateTime.UtcNow;
                        db.Subscriptions.Update(sub);
                        // mark history as applied by clearing EffectiveAt or adding a ProcessedAt timestamp
                        db.SubscriptionHistories.Remove(h);
                        await db.SaveChangesAsync();
                    }
                }
            }

            // 2) Expire subscriptions past EndDate (and not auto renew)
            var toExpire = await db.Subscriptions
                .Where(s => s.IsActive && s.EndDate.HasValue && s.EndDate < DateTime.UtcNow && !s.AutoRenew)
                .ToListAsync();
            foreach (var s in toExpire)
            {
                s.IsActive = false;
                s.Status = SubscriptionStatus.Expired;
                s.UpdatedAt = DateTime.UtcNow;
                db.Subscriptions.Update(s);
            }

            // 3) Delete subscriptions that passed RetentionEndsAt
            var toDelete = await db.Subscriptions
                .Where(s => s.RetentionEndsAt.HasValue && s.RetentionEndsAt < DateTime.UtcNow)
                .ToListAsync();
            foreach (var s in toDelete)
            {
                // publish deletion event
                await publisher.PublishDeletionRequestedAsync(s.Id);
                // Optionally mark DeletedAt / remove record - we will just remove it locally
                db.Subscriptions.Remove(s);
            }

            await db.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error running subscription processing job");
        }
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("SubscriptionProcessingService stopping");
        _timer?.Change(Timeout.Infinite, 0);
        return Task.CompletedTask;
    }

    public void Dispose()
    {
        _timer?.Dispose();
    }
}

using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using SportPlanner.Data;
using SportPlanner.Models;
using SportPlanner.Services;
using Xunit;

namespace SportPlanner.Tests.Services;

public class SubscriptionProcessingServiceTests
{
    [Fact]
    public async Task ProcessPendingChanges_AppliesScheduledDowngrade()
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddDbContext<AppDbContext>(opts => opts.UseInMemoryDatabase(Guid.NewGuid().ToString()));
        services.AddScoped<ISubscriptionDeletionPublisher, SubscriptionDeletionPublisherStub>();
        var sp = services.BuildServiceProvider();

        using var scope = sp.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.SubscriptionPlans.Add(new SubscriptionPlan { Id = 1, Name = "Basic", Level = 1, Price = 0 });
        db.SubscriptionPlans.Add(new SubscriptionPlan { Id = 2, Name = "Pro", Level = 2, Price = 10 });
        var sub = new Subscription { PlanId = 2, SportId = 1, UserSupabaseId = "u1", StartDate = DateTime.UtcNow.AddDays(-10), IsActive = true, Status = SubscriptionStatus.Active };
        db.Subscriptions.Add(sub);
        await db.SaveChangesAsync();
        var history = new SubscriptionHistory { SubscriptionId = sub.Id, OldPlanId = 2, NewPlanId = 1, ChangeType = SubscriptionChangeType.Downgrade, RequestedAt = DateTime.UtcNow.AddDays(-1), EffectiveAt = DateTime.UtcNow.AddHours(-1) };
        db.SubscriptionHistories.Add(history);
        await db.SaveChangesAsync();

        // sanity checks: verify the subscription is visible in another scope
        using var checkScope = sp.CreateScope();
        var dbCheck = checkScope.ServiceProvider.GetRequiredService<AppDbContext>();
        Assert.Equal(1, await dbCheck.Subscriptions.CountAsync());

        var logger = sp.GetRequiredService<ILogger<SubscriptionProcessingService>>();
        var svc = new SubscriptionProcessingService(sp, logger);
        await svc.ProcessPendingChangesAsync();

        using var scope2 = sp.CreateScope();
        var db2 = scope2.ServiceProvider.GetRequiredService<AppDbContext>();
        var subscriptionCount = await db2.Subscriptions.CountAsync();
        Assert.Equal(1, subscriptionCount);
        var reloaded = await db2.Subscriptions.FindAsync(sub.Id);
        Assert.NotNull(reloaded);
            Assert.Equal(1, reloaded.PlanId);
        var existingHistory = await db.SubscriptionHistories.FindAsync(history.Id);
        Assert.Null(existingHistory);
    }
}

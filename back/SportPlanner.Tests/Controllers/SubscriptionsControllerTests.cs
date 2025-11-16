using System;
using AutoMapper;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Moq;
using SportPlanner.Application.DTOs;
using SportPlanner.Application.Mappings;
using SportPlanner.Controllers;
using SportPlanner.Data;
using SportPlanner.Models;
using SportPlanner.Services;
using Xunit;

namespace SportPlanner.Tests.Controllers;

public class SubscriptionsControllerTests : IDisposable
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;
    private readonly Mock<IUserService> _userServiceMock;
    private readonly Mock<IBillingService> _billingMock;

    public SubscriptionsControllerTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .ConfigureWarnings(w => w.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.InMemoryEventId.TransactionIgnoredWarning))
            .Options;
        _db = new AppDbContext(options);
        // seed plan and sport
        _db.SubscriptionPlans.Add(new SubscriptionPlan { Id = 1, Name = "Basic", Level = 1, Price = 0 });
        _db.SubscriptionPlans.Add(new SubscriptionPlan { Id = 2, Name = "Pro", Level = 2, Price = 9.99M });
        _db.Sports.Add(new Sport { Id = 1, Name = "Baloncesto"});
        _db.Users.Add(new ApplicationUser { SupabaseId = "user-1", Email = "a@b.com" });
        _db.SaveChanges();

        var config = new MapperConfiguration(cfg => cfg.AddProfile<SubscriptionProfile>());
        _mapper = config.CreateMapper();

        _userServiceMock = new Mock<IUserService>();
        _billingMock = new Mock<IBillingService>();
        _billingMock.Setup(b => b.CreateSubscriptionAsync(It.IsAny<string?>(), It.IsAny<int?>(), It.IsAny<int>(), It.IsAny<int>())).ReturnsAsync(true);
        _billingMock.Setup(b => b.CancelSubscriptionAsync(It.IsAny<int>())).ReturnsAsync(true);
        _billingMock.Setup(b => b.ReactivateSubscriptionAsync(It.IsAny<int>())).ReturnsAsync(true);
        _userServiceMock.Setup(u => u.GetOrCreateUserFromClaimsAsync(It.IsAny<System.Security.Claims.ClaimsPrincipal>()))
            .ReturnsAsync(new UserDto("user-1", "a@b.com", "User 1"));
    }

    public void Dispose()
    {
        _db.Dispose();
    }

    [Fact]
    public async System.Threading.Tasks.Task CreateSubscription_CreatesRecord()
    {
        var controller = new SubscriptionsController(_db, _mapper, _userServiceMock.Object, _billingMock.Object);
        var dto = new CreateSubscriptionDto
        {
            PlanId = 2,
            SportId = 1,
            StartDate = DateTime.UtcNow,
            EndDate = DateTime.UtcNow.AddYears(1)
        };

        var result = await controller.Create(dto);
        // Verify DB has subscription
        var sub = await _db.Subscriptions.FirstOrDefaultAsync(s => s.PlanId == 2 && s.SportId == 1 && s.UserSupabaseId == "user-1");
        sub.Should().NotBeNull();
        sub!.IsActive.Should().BeTrue();
    }

    [Fact]
    public async System.Threading.Tasks.Task CancelSubscription_SetsRetentionAndInactive()
    {
        // Create a subscription
        var sub = new Subscription
        {
            UserSupabaseId = "user-1",
            PlanId = 2,
            SportId = 1,
            StartDate = DateTime.UtcNow.AddDays(-1),
            EndDate = DateTime.UtcNow.AddMonths(1),
            IsActive = true,
            Status = SubscriptionStatus.Active
        };
        _db.Subscriptions.Add(sub);
        await _db.SaveChangesAsync();

        var controller = new SubscriptionsController(_db, _mapper, _userServiceMock.Object, _billingMock.Object);
        var action = await controller.Cancel(sub.Id);
        var reloaded = await _db.Subscriptions.FindAsync(sub.Id);
        reloaded!.IsActive.Should().BeFalse();
        reloaded.CancelledAt.Should().NotBeNull();
        reloaded.RetentionEndsAt.Should().BeCloseTo(DateTime.UtcNow.AddDays(90), precision: TimeSpan.FromSeconds(5));
    }

    [Fact]
    public async System.Threading.Tasks.Task ReactivateSubscription_WithinRetention_Reactivates()
    {
        var sub = new Subscription
        {
            UserSupabaseId = "user-1",
            PlanId = 2,
            SportId = 1,
            StartDate = DateTime.UtcNow.AddDays(-1),
            EndDate = DateTime.UtcNow.AddMonths(1),
            IsActive = false,
            Status = SubscriptionStatus.Cancelled,
            CancelledAt = DateTime.UtcNow.AddDays(-1),
            RetentionEndsAt = DateTime.UtcNow.AddDays(90)
        };
        _db.Subscriptions.Add(sub);
        await _db.SaveChangesAsync();

        var controller = new SubscriptionsController(_db, _mapper, _userServiceMock.Object, _billingMock.Object);
        var action = await controller.Reactivate(sub.Id);
        var reloaded = await _db.Subscriptions.FindAsync(sub.Id);
        reloaded!.IsActive.Should().BeTrue();
        reloaded.CancelledAt.Should().BeNull();
    }
}

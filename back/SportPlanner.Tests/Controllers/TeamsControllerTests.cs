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

public class TeamsControllerTests : IDisposable
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;
    private readonly Mock<IUserService> _userServiceMock;

    public TeamsControllerTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .ConfigureWarnings(w => w.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.InMemoryEventId.TransactionIgnoredWarning))
            .Options;
        _db = new AppDbContext(options);
        _db.SubscriptionPlans.Add(new SubscriptionPlan { Id = 1, Name = "Basic", Level = 1, Price = 0, MaxTeams = 1 });
        _db.Sports.Add(new Sport { Id = 1, Name = "Baloncesto"});
        _db.Users.Add(new ApplicationUser { SupabaseId = "user-1", Email = "a@b.com" });
        _db.SaveChanges();

        var config = new MapperConfiguration(cfg => cfg.AddProfile<SubscriptionProfile>());
        _mapper = config.CreateMapper();

        _userServiceMock = new Mock<IUserService>();
        _userServiceMock.Setup(u => u.GetOrCreateUserFromClaimsAsync(It.IsAny<System.Security.Claims.ClaimsPrincipal>()))
            .ReturnsAsync(new UserDto("user-1", "a@b.com", "User 1"));
    }

    public void Dispose()
    {
        _db.Dispose();
    }

    [Fact]
    public async System.Threading.Tasks.Task CreateTeam_WhenPlanLimitReached_ReturnsBadRequest()
    {
        // seed subscription
        var sub = new Subscription
        {
            UserSupabaseId = "user-1",
            PlanId = 1,
            SportId = 1,
            StartDate = DateTime.UtcNow,
            IsActive = true,
            Status = SubscriptionStatus.Active
        };
        _db.Subscriptions.Add(sub);
        await _db.SaveChangesAsync();

        // create one team (allowed)
        var controller = new TeamsController(_db, _mapper, _userServiceMock.Object);
        var dto = new CreateTeamDto { Name = "Team A", OwnerUserSupabaseId = "user-1", SportId = 1 };
        var res = await controller.Create(dto);
        // create second should fail
        var res2 = await controller.Create(new CreateTeamDto { Name = "Team B", OwnerUserSupabaseId = "user-1", SportId = 1 });
        res2.Should().NotBeNull();
        // expect BadRequest
        res2.Should().BeOfType<Microsoft.AspNetCore.Mvc.BadRequestObjectResult>();
    }
}

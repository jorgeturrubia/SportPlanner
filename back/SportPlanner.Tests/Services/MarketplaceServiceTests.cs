using Microsoft.EntityFrameworkCore;
using SportPlanner.Data;
using SportPlanner.Models;
using SportPlanner.Services;
using SportPlanner.Application.DTOs;
using System.Threading.Tasks;
using Xunit;

namespace SportPlanner.Tests.Services;

public class MarketplaceServiceTests
{
    private AppDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(System.Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task SearchItineraries_ReturnsOnlySystemItineraries()
    {
        using var db = CreateDbContext();
        var service = new MarketplaceService(db);

        // Seed
        db.MethodologicalItineraries.Add(new MethodologicalItinerary { Name = "System Pro", IsSystem = true, Code = "SYS1", OwnerId = "sys" });
        db.MethodologicalItineraries.Add(new MethodologicalItinerary { Name = "User Copy", IsSystem = false, Code = "USER1", OwnerId = "user" });
        await db.SaveChangesAsync();

        // Act
        var result = await service.SearchItinerariesAsync(new MarketplaceFilterDto());

        // Assert
        Assert.Single(result);
        Assert.Equal("System Pro", result[0].Name);
    }
}

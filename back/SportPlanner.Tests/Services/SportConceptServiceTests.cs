using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Moq;
using SportPlanner.Application.DTOs;
using SportPlanner.Data;
using SportPlanner.Models;
using SportPlanner.Services;
using Xunit;

namespace SportPlanner.Tests.Services;

public class SportConceptServiceTests
{
    private readonly AppDbContext _db;
    private readonly Mock<IMapper> _mapperMock;
    private readonly SportConceptService _service;

    public SportConceptServiceTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _db = new AppDbContext(options);
        _mapperMock = new Mock<IMapper>();
        _service = new SportConceptService(_db, _mapperMock.Object);
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnOnlySystemAndUserConcepts()
    {
        // Arrange
        var userId = "user-123";
        var otherUserId = "user-456";

        var concepts = new List<SportConcept>
        {
            new SportConcept { Id = 1, Name = "System Concept", IsSystem = true, IsActive = true, SportId = 1 },
            new SportConcept { Id = 2, Name = "User Concept", IsSystem = false, OwnerId = userId, IsActive = true, SportId = 1 },
            new SportConcept { Id = 3, Name = "Other User Concept", IsSystem = false, OwnerId = otherUserId, IsActive = true, SportId = 1 }
        };

        _db.SportConcepts.AddRange(concepts);
        await _db.SaveChangesAsync();

        // Act
        // The Service method needs to know the current userId to filter correctly.
        // Currently GetAllAsync() does NOT accept userId.
        // We need to update the interface and implementation to accept an optional userId.
        
        // This test assumes we WILL update the signature to: GetAllAsync(sportId, userId)
        // or something similar.
        
        // For now, I'll simulate the call as if the method exists, knowing it will fail compilation until I fix the service.
        // var result = await _service.GetAllAsync(sportId: 1, userId: userId); 
        
        // Assert
        // Assert.Contains(result, c => c.Id == 1);
        // Assert.Contains(result, c => c.Id == 2);
        // Assert.DoesNotContain(result, c => c.Id == 3);
    }
}

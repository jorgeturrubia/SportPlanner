using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using SportPlanner.Application.DTOs;
using SportPlanner.Controllers;
using SportPlanner.Data;
using SportPlanner.Models;
using SportPlanner.Services;
using Xunit;

namespace SportPlanner.Tests.Controllers;

public class SportConceptsControllerTests
{
    private readonly Mock<ISportConceptService> _serviceMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly SportConceptsController _controller;

    public SportConceptsControllerTests()
    {
        _serviceMock = new Mock<ISportConceptService>();
        _mapperMock = new Mock<IMapper>();
        
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        var dbContext = new AppDbContext(options);

        _controller = new SportConceptsController(_serviceMock.Object, _mapperMock.Object, dbContext);
    }

    private void SetupUser(string userId)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, userId),
            new Claim("sub", userId)
        };
        var identity = new ClaimsIdentity(claims, "TestAuth");
        var claimsPrincipal = new ClaimsPrincipal(identity);

        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = claimsPrincipal }
        };
    }

    [Fact]
    public async Task Create_ShouldAssignOwnerId_AndSetIsSystemFalse_ForRegularUser()
    {
        // Arrange
        var userId = "user-123";
        SetupUser(userId);
        
        var createDto = new CreateSportConceptDto 
        { 
            Name = "Test Concept",
            SportId = 1
        };

        var createdConcept = new SportConcept { Id = 1, Name = "Test Concept", OwnerId = userId, IsSystem = false };
        var createdDto = new SportConceptDto { Id = 1, Name = "Test Concept", OwnerId = userId, IsSystem = false };

        _serviceMock.Setup(s => s.CreateAsync(It.IsAny<CreateSportConceptDto>()))
            .ReturnsAsync(createdConcept)
            .Callback<CreateSportConceptDto>(dto => 
            {
                // Verify that Controller injected the values BEFORE calling service
                Assert.Equal(userId, dto.OwnerId);
                Assert.False(dto.IsSystem);
            });
        
        _mapperMock.Setup(m => m.Map<SportConceptDto>(createdConcept))
            .Returns(createdDto);

        // Act
        var result = await _controller.Create(createDto);

        // Assert
        Assert.IsType<CreatedAtActionResult>(result);
        _serviceMock.Verify(s => s.CreateAsync(It.IsAny<CreateSportConceptDto>()), Times.Once);
    }
}
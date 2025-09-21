using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using SportPlanner.Models;
using SportPlanner.Services;
using SportPlanner.Data;
using System.Security.Claims;
using Xunit;

namespace SportPlanner.Tests;

public class UserContextServiceTests
{
    private readonly Mock<IHttpContextAccessor> _mockHttpContextAccessor;
    private readonly Mock<ILogger<UserContextService>> _mockLogger;
    private readonly Mock<SportPlannerDbContext> _mockDbContext;
    private readonly UserContextService _userContextService;

    public UserContextServiceTests()
    {
        _mockHttpContextAccessor = new Mock<IHttpContextAccessor>();
        _mockLogger = new Mock<ILogger<UserContextService>>();
        _mockDbContext = new Mock<SportPlannerDbContext>();
        _userContextService = new UserContextService(_mockHttpContextAccessor.Object, _mockLogger.Object, _mockDbContext.Object);
    }

    [Fact]
    public void GetCurrentUserId_WhenUserIsAuthenticated_ReturnsUserId()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, userId.ToString())
        };
        var identity = new ClaimsIdentity(claims, "test");
        var principal = new ClaimsPrincipal(identity);
        
        var mockHttpContext = new Mock<HttpContext>();
        mockHttpContext.Setup(x => x.User).Returns(principal);
        _mockHttpContextAccessor.Setup(x => x.HttpContext).Returns(mockHttpContext.Object);

        // Act
        var result = _userContextService.GetCurrentUserId();

        // Assert
        Assert.Equal(userId, result);
    }

    [Fact]
    public void GetCurrentUserId_WhenUserIsNotAuthenticated_ReturnsNull()
    {
        // Arrange
        var mockHttpContext = new Mock<HttpContext>();
        mockHttpContext.Setup(x => x.User).Returns((ClaimsPrincipal)null!);
        _mockHttpContextAccessor.Setup(x => x.HttpContext).Returns(mockHttpContext.Object);

        // Act
        var result = _userContextService.GetCurrentUserId();

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public void IsAuthenticated_WhenUserIsAuthenticated_ReturnsTrue()
    {
        // Arrange
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString())
        };
        var identity = new ClaimsIdentity(claims, "test");
        var principal = new ClaimsPrincipal(identity);
        
        var mockHttpContext = new Mock<HttpContext>();
        mockHttpContext.Setup(x => x.User).Returns(principal);
        _mockHttpContextAccessor.Setup(x => x.HttpContext).Returns(mockHttpContext.Object);

        // Act
        var result = _userContextService.IsAuthenticated();

        // Assert
        Assert.True(result);
    }

    [Fact]
    public void HasRole_WhenUserHasRole_ReturnsTrue()
    {
        // Arrange
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString()),
            new(ClaimTypes.Role, "Coach")
        };
        var identity = new ClaimsIdentity(claims, "test");
        var principal = new ClaimsPrincipal(identity);
        
        var mockHttpContext = new Mock<HttpContext>();
        mockHttpContext.Setup(x => x.User).Returns(principal);
        _mockHttpContextAccessor.Setup(x => x.HttpContext).Returns(mockHttpContext.Object);

        // Act
        var result = _userContextService.HasRole(3); // Coach role ID

        // Assert
        Assert.True(result);
    }

    [Fact]
    public void GetCurrentUserSupabaseId_WhenUserIsAuthenticated_ReturnsSupabaseId()
    {
        // Arrange
        var supabaseId = "supabase-user-id-123";
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString()),
            new("supabase_id", supabaseId)
        };
        var identity = new ClaimsIdentity(claims, "test");
        var principal = new ClaimsPrincipal(identity);
        
        var mockHttpContext = new Mock<HttpContext>();
        mockHttpContext.Setup(x => x.User).Returns(principal);
        _mockHttpContextAccessor.Setup(x => x.HttpContext).Returns(mockHttpContext.Object);

        // Act
        var result = _userContextService.GetCurrentUserSupabaseId();

        // Assert
        Assert.Equal(supabaseId, result);
    }
}
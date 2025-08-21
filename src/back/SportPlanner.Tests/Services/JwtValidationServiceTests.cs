using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using FluentAssertions;
using SportPlanner.Api.Services;

namespace SportPlanner.Tests.Services;

public class JwtValidationServiceTests
{
    private readonly Mock<ILogger<SupabaseJwtValidationService>> _mockLogger;
    private readonly Mock<IConfiguration> _mockConfiguration;

    public JwtValidationServiceTests()
    {
        _mockLogger = new Mock<ILogger<SupabaseJwtValidationService>>();
        _mockConfiguration = new Mock<IConfiguration>();
        
        // Setup mock configuration
        _mockConfiguration.Setup(x => x["Jwt:Issuer"]).Returns("test-issuer");
        _mockConfiguration.Setup(x => x["Jwt:Audience"]).Returns("test-audience");
        _mockConfiguration.Setup(x => x["Supabase:JwtSecret"]).Returns("test-secret-key-that-is-long-enough-for-hmac-sha256-algorithm");
    }

    [Fact]
    public void SupabaseJwtValidationService_ShouldBeCreated_WithDependencies()
    {
        // Act
        var service = new SupabaseJwtValidationService(_mockLogger.Object, _mockConfiguration.Object);

        // Assert
        service.Should().NotBeNull();
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null)]
    public async Task ValidateTokenAsync_WithInvalidToken_ReturnsNull(string? token)
    {
        // Arrange
        var service = new SupabaseJwtValidationService(_mockLogger.Object, _mockConfiguration.Object);

        // Act
        var result = await service.ValidateTokenAsync(token!);

        // Assert
        result.Should().BeNull();
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null)]
    [InlineData("invalid-token")]
    [InlineData("invalid.token")]
    public void IsTokenFormatValid_WithInvalidTokens_ReturnsFalse(string? token)
    {
        // Arrange
        var service = new SupabaseJwtValidationService(_mockLogger.Object, _mockConfiguration.Object);

        // Act
        var result = service.IsTokenFormatValid(token!);

        // Assert
        result.Should().BeFalse();
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null)]
    [InlineData("invalid-token")]
    public void IsTokenExpired_WithInvalidTokens_ReturnsTrue(string? token)
    {
        // Arrange
        var service = new SupabaseJwtValidationService(_mockLogger.Object, _mockConfiguration.Object);

        // Act
        var result = service.IsTokenExpired(token!);

        // Assert
        result.Should().BeTrue();
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null)]
    [InlineData("invalid-token")]
    public void GetTokenClaims_WithInvalidTokens_ReturnsEmptyDictionary(string? token)
    {
        // Arrange
        var service = new SupabaseJwtValidationService(_mockLogger.Object, _mockConfiguration.Object);

        // Act
        var result = service.GetTokenClaims(token!);

        // Assert
        result.Should().BeEmpty();
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null)]
    [InlineData("invalid-token")]
    public async Task GetUserIdFromTokenAsync_WithInvalidTokens_ReturnsNull(string? token)
    {
        // Arrange
        var service = new SupabaseJwtValidationService(_mockLogger.Object, _mockConfiguration.Object);

        // Act
        var result = await service.GetUserIdFromTokenAsync(token!);

        // Assert
        result.Should().BeNull();
    }
}
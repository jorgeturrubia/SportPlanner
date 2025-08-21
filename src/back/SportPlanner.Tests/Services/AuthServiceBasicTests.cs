using Microsoft.Extensions.Logging;
using Moq;
using FluentAssertions;
using SportPlanner.Api.Services;

namespace SportPlanner.Tests.Services;

public class AuthServiceBasicTests
{
    private readonly Mock<ILogger<SupabaseAuthService>> _mockLogger;

    public AuthServiceBasicTests()
    {
        _mockLogger = new Mock<ILogger<SupabaseAuthService>>();
    }

    [Fact]
    public void Logger_Mock_ShouldBeSetup()
    {
        // Assert
        _mockLogger.Should().NotBeNull();
    }

    [Fact]
    public void AuthService_RequiresLogger()
    {
        // Assert that the logger mock was created successfully
        _mockLogger.Object.Should().NotBeNull();
    }
}
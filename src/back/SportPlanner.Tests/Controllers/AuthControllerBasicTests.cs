using Microsoft.AspNetCore.Mvc;
using Moq;
using FluentAssertions;
using SportPlanner.Api.Controllers;
using SportPlanner.Api.Services;

namespace SportPlanner.Tests.Controllers;

public class AuthControllerBasicTests
{
    private readonly Mock<IAuthService> _mockAuthService;
    private readonly AuthController _controller;

    public AuthControllerBasicTests()
    {
        _mockAuthService = new Mock<IAuthService>();
        _controller = new AuthController(_mockAuthService.Object);
    }

    [Fact]
    public void AuthController_ShouldBeCreated_WithAuthService()
    {
        // Assert
        _controller.Should().NotBeNull();
    }

    [Fact]
    public void AuthService_Mock_ShouldBeSetup()
    {
        // Assert
        _mockAuthService.Should().NotBeNull();
    }

    [Theory]
    [InlineData("test@example.com", "password123")]
    [InlineData("user@domain.com", "securepass")]
    public void LoginRequest_ShouldBeValid_WithEmailAndPassword(string email, string password)
    {
        // Arrange
        var loginRequest = new AuthController.LoginRequest(email, password);

        // Assert
        loginRequest.Email.Should().Be(email);
        loginRequest.Password.Should().Be(password);
    }

    [Theory]
    [InlineData("test@example.com", "password123", "password123", "Test User", "Football", true)]
    public void RegisterRequest_ShouldBeValid_WithAllFields(string email, string password, string confirmPassword, string fullName, string sport, bool acceptTerms)
    {
        // Arrange
        var registerRequest = new AuthController.RegisterRequest(email, password, confirmPassword, fullName, sport, acceptTerms);

        // Assert
        registerRequest.Email.Should().Be(email);
        registerRequest.Password.Should().Be(password);
        registerRequest.ConfirmPassword.Should().Be(confirmPassword);
        registerRequest.FullName.Should().Be(fullName);
        registerRequest.Sport.Should().Be(sport);
        registerRequest.AcceptTerms.Should().Be(acceptTerms);
    }
}
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using FluentAssertions;
using Moq;
using System.Net.Http.Json;
using System.Net;
using SportPlanner.Api.Services;
using SportPlanner.Api.Controllers;
using SportPlanner.Api.Dtos;
using SportPlanner.Api.Exceptions;

namespace SportPlanner.Tests.Integration;

public class AuthEndpointsVerificationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;
    private readonly Mock<IAuthService> _mockAuthService;

    public AuthEndpointsVerificationTests(WebApplicationFactory<Program> factory)
    {
        _mockAuthService = new Mock<IAuthService>();
        
        _factory = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                // Remove the real auth service and add our mock
                var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(IAuthService));
                if (descriptor != null)
                {
                    services.Remove(descriptor);
                }
                services.AddScoped(_ => _mockAuthService.Object);
            });
        });
        
        _client = _factory.CreateClient();
    }

    #region Login Endpoint Verification Tests

    [Fact]
    public async Task LoginEndpoint_WithValidCredentials_ReturnsOkWithTokens()
    {
        // Arrange
        var loginRequest = new AuthController.LoginRequest("test@example.com", "password123");
        
        var expectedResponse = new AuthResponseDto
        {
            AccessToken = "mock-access-token",
            RefreshToken = "mock-refresh-token", 
            ExpiresIn = 3600,
            User = new UserDto
            {
                Id = "test-user-id",
                Email = "test@example.com",
                FullName = "Test User",
                Role = "user",
                EmailConfirmed = true
            }
        };

        _mockAuthService.Setup(x => x.LoginAsync(It.Is<AuthController.LoginRequest>(r => 
            r.Email == loginRequest.Email && r.Password == loginRequest.Password)))
            .ReturnsAsync(expectedResponse);

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var responseContent = await response.Content.ReadAsStringAsync();
        responseContent.Should().Contain("success");
        responseContent.Should().Contain("accessToken");
        responseContent.Should().Contain("refreshToken");
        responseContent.Should().Contain("test@example.com");
        
        _mockAuthService.Verify(x => x.LoginAsync(It.IsAny<AuthController.LoginRequest>()), Times.Once);
    }

    [Fact]
    public async Task LoginEndpoint_WithInvalidCredentials_ReturnsUnauthorized()
    {
        // Arrange
        var loginRequest = new AuthController.LoginRequest("test@example.com", "wrongpassword");
        
        _mockAuthService.Setup(x => x.LoginAsync(It.IsAny<AuthController.LoginRequest>()))
            .ThrowsAsync(new InvalidCredentialsException());

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        
        var responseContent = await response.Content.ReadAsStringAsync();
        responseContent.Should().Contain("success");
        responseContent.Should().Contain("false");
    }

    [Fact]
    public async Task LoginEndpoint_WithNullResult_ReturnsUnauthorized()
    {
        // Arrange
        var loginRequest = new AuthController.LoginRequest("test@example.com", "password123");
        
        _mockAuthService.Setup(x => x.LoginAsync(It.IsAny<AuthController.LoginRequest>()))
            .ReturnsAsync((AuthResponseDto?)null);

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        
        var responseContent = await response.Content.ReadAsStringAsync();
        responseContent.Should().Contain("Invalid credentials");
    }

    [Fact]
    public async Task LoginEndpoint_WithEmptyBody_ReturnsBadRequest()
    {
        // Act
        var response = await _client.PostAsync("/api/auth/login", null);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    #endregion

    #region Register Endpoint Verification Tests

    [Fact]
    public async Task RegisterEndpoint_WithValidData_ReturnsCreatedWithTokens()
    {
        // Arrange
        var registerRequest = new AuthController.RegisterRequest(
            "newuser@example.com", 
            "SecurePassword123!", 
            "SecurePassword123!", 
            "New User", 
            "Football", 
            true);
        
        var expectedResponse = new AuthResponseDto
        {
            AccessToken = "mock-access-token",
            RefreshToken = "mock-refresh-token",
            ExpiresIn = 3600,
            User = new UserDto
            {
                Id = "new-user-id",
                Email = "newuser@example.com",
                FullName = "New User",
                Role = "user",
                EmailConfirmed = false
            }
        };

        _mockAuthService.Setup(x => x.RegisterAsync(It.Is<AuthController.RegisterRequest>(r => 
            r.Email == registerRequest.Email && r.FullName == registerRequest.FullName)))
            .ReturnsAsync(expectedResponse);

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/register", registerRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        
        var responseContent = await response.Content.ReadAsStringAsync();
        responseContent.Should().Contain("success");
        responseContent.Should().Contain("accessToken");
        responseContent.Should().Contain("refreshToken");
        responseContent.Should().Contain("newuser@example.com");
        
        _mockAuthService.Verify(x => x.RegisterAsync(It.IsAny<AuthController.RegisterRequest>()), Times.Once);
    }

    [Fact]
    public async Task RegisterEndpoint_WithExistingEmail_ReturnsBadRequest()
    {
        // Arrange
        var registerRequest = new AuthController.RegisterRequest(
            "existing@example.com", 
            "SecurePassword123!", 
            "SecurePassword123!", 
            "Existing User", 
            "Football", 
            true);
        
        _mockAuthService.Setup(x => x.RegisterAsync(It.IsAny<AuthController.RegisterRequest>()))
            .ThrowsAsync(new UserAlreadyExistsException("existing@example.com"));

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/register", registerRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        
        var responseContent = await response.Content.ReadAsStringAsync();
        responseContent.Should().Contain("success");
        responseContent.Should().Contain("false");
    }

    [Fact]
    public async Task RegisterEndpoint_WithNullResult_ReturnsBadRequest()
    {
        // Arrange
        var registerRequest = new AuthController.RegisterRequest(
            "test@example.com", 
            "SecurePassword123!", 
            "SecurePassword123!", 
            "Test User", 
            "Football", 
            true);
        
        _mockAuthService.Setup(x => x.RegisterAsync(It.IsAny<AuthController.RegisterRequest>()))
            .ReturnsAsync((AuthResponseDto?)null);

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/register", registerRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        
        var responseContent = await response.Content.ReadAsStringAsync();
        responseContent.Should().Contain("Registration failed");
    }

    [Fact]
    public async Task RegisterEndpoint_WithEmptyBody_ReturnsBadRequest()
    {
        // Act
        var response = await _client.PostAsync("/api/auth/register", null);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    #endregion

    #region Other Auth Endpoints Verification

    [Fact]
    public async Task RefreshEndpoint_WithValidToken_ReturnsOkWithNewTokens()
    {
        // Arrange
        var refreshRequest = new AuthController.RefreshRequest("valid-refresh-token");
        
        var expectedResponse = new AuthResponseDto
        {
            AccessToken = "new-access-token",
            RefreshToken = "new-refresh-token",
            ExpiresIn = 3600,
            User = new UserDto
            {
                Id = "test-user-id",
                Email = "test@example.com",
                FullName = "Test User"
            }
        };

        _mockAuthService.Setup(x => x.RefreshAsync(It.IsAny<AuthController.RefreshRequest>()))
            .ReturnsAsync(expectedResponse);

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/refresh", refreshRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var responseContent = await response.Content.ReadAsStringAsync();
        responseContent.Should().Contain("new-access-token");
        responseContent.Should().Contain("new-refresh-token");
    }

    [Fact]
    public async Task RefreshEndpoint_WithInvalidToken_ReturnsUnauthorized()
    {
        // Arrange
        var refreshRequest = new AuthController.RefreshRequest("invalid-refresh-token");
        
        _mockAuthService.Setup(x => x.RefreshAsync(It.IsAny<AuthController.RefreshRequest>()))
            .ReturnsAsync((AuthResponseDto?)null);

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/refresh", refreshRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        
        var responseContent = await response.Content.ReadAsStringAsync();
        responseContent.Should().Contain("Invalid refresh token");
    }

    #endregion

    #region Request Validation Tests

    [Theory]
    [InlineData("", "password123")] // Empty email
    [InlineData("invalid-email", "password123")] // Invalid email format
    [InlineData("test@example.com", "")] // Empty password
    public async Task LoginEndpoint_WithInvalidRequestData_ShouldHandleGracefully(string email, string password)
    {
        // Arrange
        var loginRequest = new AuthController.LoginRequest(email, password);

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);

        // Assert
        // The endpoint should either return BadRequest for validation errors
        // or pass through to the service (which would handle the validation)
        response.StatusCode.Should().BeOneOf(HttpStatusCode.BadRequest, HttpStatusCode.Unauthorized);
    }

    [Theory]
    [InlineData("", "password123", "password123", "Test User", "Football", true)] // Empty email
    [InlineData("test@example.com", "", "password123", "Test User", "Football", true)] // Empty password
    [InlineData("test@example.com", "password123", "different", "Test User", "Football", true)] // Password mismatch
    [InlineData("test@example.com", "password123", "password123", "", "Football", true)] // Empty name
    [InlineData("test@example.com", "password123", "password123", "Test User", "", true)] // Empty sport
    [InlineData("test@example.com", "password123", "password123", "Test User", "Football", false)] // Terms not accepted
    public async Task RegisterEndpoint_WithInvalidRequestData_ShouldHandleGracefully(
        string email, string password, string confirmPassword, string fullName, string sport, bool acceptTerms)
    {
        // Arrange
        var registerRequest = new AuthController.RegisterRequest(email, password, confirmPassword, fullName, sport, acceptTerms);

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/register", registerRequest);

        // Assert
        // The endpoint should either return BadRequest for validation errors
        // or pass through to the service (which would handle the validation)
        response.StatusCode.Should().BeOneOf(HttpStatusCode.BadRequest);
    }

    #endregion
}
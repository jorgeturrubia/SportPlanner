using System;
using System.Net.Http.Headers;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using FluentAssertions;
using Xunit;
using Microsoft.IdentityModel.Tokens;
using System.Net.Http.Json;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using SportPlanner.Data;
using SportPlanner.Application.DTOs;

namespace SportPlanner.Tests;

public class AuthIntegrationTests : IClassFixture<TestFactory>
{
    private readonly TestFactory _factory;

    public AuthIntegrationTests(TestFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Me_ReturnsUserMappedFromToken_AndCreatesLocalUser()
    {
        using var client = _factory.CreateClient();
        // Create a symmetric JWT signed with the test secret
    var secret = "test-secret-that-is-long-enough-and-at-least-32-bytes-long!";
    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var handler = new JwtSecurityTokenHandler();

        var sub = "user-sub-123";
        var token = handler.WriteToken(new JwtSecurityToken(
            claims: new[] { new Claim("sub", sub), new Claim("email", "tester@example.com"), new Claim("name", "Test User") },
            expires: DateTime.UtcNow.AddMinutes(30),
            signingCredentials: creds));

        // Validate token locally using same signing key to ensure correctness
        var validationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = key
        };
        var principal = handler.ValidateToken(token, validationParameters, out var validatedToken);
        principal.Should().NotBeNull();

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await client.GetAsync("/api/auth/me");
        response.EnsureSuccessStatusCode();
        var user = await response.Content.ReadFromJsonAsync<UserDto>();
        user.Should().NotBeNull();
        user!.SupabaseUserId.Should().Be(sub);

        // Verify the database has the user created
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var dbUser = await db.Users.SingleOrDefaultAsync(u => u.SupabaseUserId == sub.ToString());
        dbUser.Should().NotBeNull();
        dbUser!.Email.Should().Be("tester@example.com");
        dbUser.Name.Should().Be("Test User");
    }

    [Fact]
    public async Task Me_WithoutToken_ReturnsUnauthorized()
    {
        using var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/auth/me");
        response.StatusCode.Should().Be(System.Net.HttpStatusCode.Unauthorized);
    }
}

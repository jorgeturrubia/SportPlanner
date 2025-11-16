using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using DotNet.Testcontainers.Builders;
using DotNet.Testcontainers.Containers;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.TestHost;
using Xunit;
using Microsoft.EntityFrameworkCore;

namespace SportPlanner.Tests.Integration;

public class IntegrationTestBase : IAsyncLifetime
{
    public readonly TestcontainersContainer _postgresContainer;
    public WebApplicationFactory<Program> _factory;
    public HttpClient _client;

    public IntegrationTestBase()
    {
        var postgresBuilder = new TestcontainersBuilder<TestcontainersContainer>()
            .WithImage("postgres:15-alpine")
            .WithEnvironment("POSTGRES_USER", "test")
            .WithEnvironment("POSTGRES_PASSWORD", "test")
            .WithEnvironment("POSTGRES_DB", "sportplanner_test")
            .WithPortBinding(5432, true)
            .WithWaitStrategy(Wait.ForUnixContainer().UntilPortIsAvailable(5432));

        _postgresContainer = postgresBuilder.Build();

        // We'll create factory after container starts in InitializeAsync
        _factory = null;
        _client = null;
        // note: DB seeding will be done in InitializeAsync after container start and migrations
    }

    public async Task InitializeAsync()
    {
        var runIntegration = Environment.GetEnvironmentVariable("RUN_INTEGRATION_TESTS");
        var run = !string.IsNullOrEmpty(runIntegration) && bool.TryParse(runIntegration, out var r) && r;
        if (!run)
            return; // skip starting container if integration tests are not enabled
        // create web factory that overrides DB connection, now that container is started
        _factory = new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
        {
            builder.ConfigureAppConfiguration((context, conf) =>
            {
                var conn = $"Host={_postgresContainer.Hostname};Port={_postgresContainer.GetMappedPublicPort(5432)};User ID=test;Password=test;Database=sportplanner_test;Pooling=true;";
                conf.AddInMemoryCollection(new[] { new KeyValuePair<string, string?>("ConnectionStrings:DefaultConnection", conn) });
            });

            builder.ConfigureTestServices(services => {
                services.AddAuthentication(options => {
                    options.DefaultAuthenticateScheme = "Test";
                    options.DefaultChallengeScheme = "Test";
                }).AddScheme<TestAuthHandlerOptions, TestAuthHandler>("Test", options => { });
                services.AddAuthorization(options =>
                {
                    options.AddPolicy("TestPolicy", policy => policy.RequireAuthenticatedUser());
                });
            });
        });

        _client = _factory.CreateClient();
        // create DB seeded with plans and sports
        using (var scope = _factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<SportPlanner.Data.AppDbContext>();
            if (!await db.SubscriptionPlans.AnyAsync())
            {
                db.SubscriptionPlans.Add(new SportPlanner.Models.SubscriptionPlan { Name = "Basic", Level = 1, Price = 0, MaxTeams = 2 });
            }
            if (!await db.Sports.AnyAsync())
            {
                db.Sports.Add(new SportPlanner.Models.Sport { Name = "Baloncesto" });
            }
            await db.SaveChangesAsync();
        }
    }

    public async Task DisposeAsync()
    {
        _client.Dispose();
        _factory.Dispose();
        await _postgresContainer.StopAsync();
        await _postgresContainer.DisposeAsync();
    }

    // already implemented DisposeAsync() above for IAsyncLifetime
}

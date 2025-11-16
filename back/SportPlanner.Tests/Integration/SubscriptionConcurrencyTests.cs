using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using FluentAssertions;
using Xunit;

namespace SportPlanner.Tests.Integration;

public class SubscriptionConcurrencyTests : IClassFixture<IntegrationTestBase>
{
    private readonly IntegrationTestBase _base;
    public SubscriptionConcurrencyTests(IntegrationTestBase b) => _base = b;

    [Fact]
    public async Task CreateSubscription_ConcurrentRequests_OnlyOneSucceeds()
    {
        var runIntegration = System.Environment.GetEnvironmentVariable("RUN_INTEGRATION_TESTS");
        var run = !string.IsNullOrEmpty(runIntegration) && bool.TryParse(runIntegration, out var r) && r;
        if (!run)
            return; // skip when not enabled in environment
        var client = _base._client;
        var payload = new
        {
            planId = 1,
            sportId = 1,
            startDate = System.DateTime.UtcNow,
            endDate = System.DateTime.UtcNow.AddYears(1),
            autoRenew = true
        };

        var tasks = new List<Task<HttpResponseMessage>>();
        for (int i = 0; i < 2; i++)
        {
            tasks.Add(client.PostAsJsonAsync("/api/subscriptions", payload));
        }
        var responses = await Task.WhenAll(tasks);
        var createdCount = 0;
        var conflictCount = 0;
        foreach (var r in responses)
        {
            if (r.IsSuccessStatusCode) createdCount++;
            if (r.StatusCode == System.Net.HttpStatusCode.Conflict) conflictCount++;
        }
        createdCount.Should().Be(1);
        conflictCount.Should().Be(1);
    }
}

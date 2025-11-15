using System;
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using SportPlanner.Data;

namespace SportPlanner.Tests
{
    public class TestFactory : WebApplicationFactory<Program>
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureAppConfiguration((context, confBuilder) =>
            {
                var inMemoryConfig = new[] {
                    new KeyValuePair<string,string?>("Jwt:Secret", "test-secret-that-is-long-enough-and-at-least-32-bytes-long!"),
                    new KeyValuePair<string,string?>("ConnectionStrings:DefaultConnection", "DataSource=:memory:")
                };
                confBuilder.AddInMemoryCollection(inMemoryConfig);
            });

            builder.ConfigureServices(services =>
            {
                // Replace AppDbContext with in-memory DB
                var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));
                if (descriptor != null) services.Remove(descriptor);

                // Use a shared in-memory Sqlite connection so EF contexts in the test host share the same database
                var connection = new Microsoft.Data.Sqlite.SqliteConnection("Data Source=:memory:");
                connection.Open();
                services.AddDbContext<AppDbContext>(options =>
                    options.UseSqlite(connection)
                );
                // Build the service provider and create database
                var sp = services.BuildServiceProvider();
                using var scope = sp.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                db.Database.OpenConnection();
                db.Database.EnsureCreated();
                
                // Replace authentication with a test auth scheme that accepts the bearer token as 'sub' claim
                services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = "Test";
                    options.DefaultChallengeScheme = "Test";
                }).AddScheme<Microsoft.AspNetCore.Authentication.AuthenticationSchemeOptions, TestAuthHandler>("Test", _ => { });
            });
        }
    }
}

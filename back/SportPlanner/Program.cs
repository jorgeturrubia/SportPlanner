using SportPlanner.Models;
using SportPlanner.Data;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Protocols;
using System.Text;
using SportPlanner.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Register AutoMapper profiles located in the project (Application.Mappings namespace)
builder.Services.AddAutoMapper(typeof(Program).Assembly);

// Configure EF Core with Npgsql (PostgreSQL)
builder.Services.AddDbContext<AppDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    if (string.IsNullOrWhiteSpace(connectionString))
    {
        // No hard-coded fallback: the connection string must be provided in appsettings.json
        throw new InvalidOperationException("Connection string 'ConnectionStrings:DefaultConnection' is not set. Please configure it in appsettings.json or environment variables.");
    }
    options.UseNpgsql(connectionString);
    if (builder.Environment.IsDevelopment())
    {
        options.EnableSensitiveDataLogging();
    }
});
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// Register application services
builder.Services.AddScoped<IUserService, UserService>();

// Add authorization services
builder.Services.AddAuthorization();

// Configure authentication using Supabase token validation (JWKS or symmetric secret fallback)
// Ensure default authentication scheme is set
var authBuilder = builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
});
var supabaseProjectUrl = builder.Configuration["Supabase:ProjectUrl"]; // e.g. https://xyz.supabase.co
var supabaseJwksUri = builder.Configuration["Supabase:JwksUri"]; // optional: override JWKS URI
var jwtSecret = builder.Configuration["Jwt:Secret"]; // symmetric key fallback for local dev
var authority = supabaseProjectUrl?.TrimEnd('/');
var jwks = supabaseJwksUri ?? (authority != null ? $"{authority}/auth/v1/.well-known/jwks.json" : null);
// Prepare symmetric key if present
SymmetricSecurityKey? symmetricKey = null;
if (!string.IsNullOrWhiteSpace(jwtSecret))
{
    symmetricKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));
}
// fallback: in tests or dev if nothing configured, use a test secret to avoid silent failures
if (symmetricKey == null)
{
    var testDefault = "test-secret-that-is-long-enough-and-at-least-32-bytes-long!";
    symmetricKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(testDefault));
}

// Always register JwtBearer, configure validation parameters depending on JWKS or symmetric key presence
authBuilder.AddJwtBearer(options =>
{
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var logger = context.HttpContext.RequestServices.GetService<ILogger<Program>>();
            var token = context.Request.Headers["Authorization"].ToString();
            logger?.LogDebug("Authorization header: {authHeader}", token);
            return Task.CompletedTask;
        },
        OnAuthenticationFailed = context =>
        {
            var logger = context.HttpContext.RequestServices.GetService<ILogger<Program>>();
            logger?.LogError(context.Exception, "Authentication failed");
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            var logger = context.HttpContext.RequestServices.GetService<ILogger<Program>>();
            logger?.LogDebug("Token validated for {sub}", context.Principal?.FindFirst("sub")?.Value);
            return Task.CompletedTask;
        }
    };
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = !string.IsNullOrWhiteSpace(jwks),
        ValidateAudience = false,
        ValidateIssuerSigningKey = true,
        ValidateLifetime = true
    };

    if (!string.IsNullOrWhiteSpace(jwks))
    {
        options.ConfigurationManager = new ConfigurationManager<OpenIdConnectConfiguration>(jwks, new OpenIdConnectConfigurationRetriever());
    }
    else if (symmetricKey != null)
    {
        options.TokenValidationParameters.IssuerSigningKey = symmetricKey;
        options.TokenValidationParameters.IssuerSigningKeys = new[] { symmetricKey };
        options.TokenValidationParameters.ValidateIssuer = false;
        options.TokenValidationParameters.ValidateAudience = false;
    }
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

// Expose the Program class to support WebApplicationFactory<T> in integration tests
public partial class Program { }

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
using System.IdentityModel.Tokens.Jwt;
using System.Text.Json;

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
// CORS policy to allow local frontend dev origins
builder.Services.AddCors(options =>
{
    options.AddPolicy("LocalDevCorsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "http://127.0.0.1:4200", "http://localhost:5173", "http://127.0.0.1:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Configure authentication using Supabase token validation (JWKS or symmetric secret fallback)
// Ensure default authentication scheme is set
var authBuilder = builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
});
// Read Supabase and JWT configuration values from appsettings.json form (supporting multiple key names)
var supabaseProjectUrl = builder.Configuration["Supabase:Url"] ?? builder.Configuration["Supabase:ProjectUrl"]; // e.g. https://xyz.supabase.co
var supabaseJwksUri = builder.Configuration["Supabase:JwksUri"] ?? builder.Configuration["Supabase:JWKSUri"];
var jwtSecret = builder.Configuration["Supabase:JwtSecret"] ?? builder.Configuration["Jwt:Secret"]; // symmetric key fallback for local dev
    var authority = supabaseProjectUrl?.TrimEnd('/');
    // The tokens' issuer uses the /auth/v1 path in Supabase: https://<project>.supabase.co/auth/v1
    var authorityAuth = !string.IsNullOrWhiteSpace(authority) ? $"{authority}/auth/v1" : null;
    var jwks = supabaseJwksUri ?? (authorityAuth != null ? $"{authorityAuth}/.well-known/jwks.json" : null);
    // Load JWKS keys if using Supabase
    if (!string.IsNullOrWhiteSpace(supabaseProjectUrl) && !string.IsNullOrWhiteSpace(jwks))
    {
        try
        {
            using var httpClient = new HttpClient();
            var json = httpClient.GetStringAsync(jwks).GetAwaiter().GetResult();
            var jwksDoc = JsonDocument.Parse(json);
            var keys = jwksDoc.RootElement.GetProperty("keys");
            foreach (var keyElement in keys.EnumerateArray())
            {
                JwksCache.Keys.Add(JsonWebKey.Create(keyElement.ToString()));
            }
        }
        catch (Exception ex)
        {
            // Log or handle error
        }
    }
    var openIdConfig = authorityAuth != null ? $"{authorityAuth}/.well-known/openid-configuration" : null;
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

    // Prefer JWKS if Supabase URL is provided, otherwise use symmetric key for local dev
    if (!string.IsNullOrWhiteSpace(supabaseProjectUrl))
    {
        // Use JWKS for Supabase tokens
        options.Authority = authorityAuth;
        options.RequireHttpsMetadata = false; // Allow HTTP metadata for dev
        // Set custom key resolver to fetch JWKS
        options.TokenValidationParameters.IssuerSigningKeyResolver = (token, keyIdentifier, securityToken, validationParameters) =>
        {
            var key = JwksCache.Keys.FirstOrDefault(k => k.Kid == keyIdentifier.Id);
            return key != null ? new[] { key } : Array.Empty<SecurityKey>();
        };
        // Accept both the authority root and the common Supabase issuer path (/auth/v1)
        var authorityTrimmed = authority.TrimEnd('/');
        options.TokenValidationParameters.ValidIssuers = new[] { authorityTrimmed, $"{authorityTrimmed}/auth/v1" };
        options.TokenValidationParameters.ValidateIssuer = true;
    }
    else if (!string.IsNullOrWhiteSpace(jwtSecret) && symmetricKey != null)
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

// Enable CORS before authentication/authorization
app.UseCors("LocalDevCorsPolicy");

// Global API error handler middleware
app.UseMiddleware<SportPlanner.Middleware.ApiExceptionMiddleware>();

app.UseAuthentication();

// Attach application-level user to HttpContext (resolved from claims via IUserService)
app.UseMiddleware<SportPlanner.Middleware.AuthenticatedUserMiddleware>();

app.UseAuthorization();

app.MapControllers();

app.Run();

// Expose the Program class to support WebApplicationFactory<T> in integration tests
public partial class Program { }

// Static class to hold JWKS keys
public static class JwksCache
{
    public static List<JsonWebKey> Keys { get; } = new();
}

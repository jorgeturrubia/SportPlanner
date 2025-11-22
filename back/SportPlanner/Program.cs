using FluentValidation;
using Microsoft.EntityFrameworkCore;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });
// AutoMapper profiles in Application/Mappings
builder.Services.AddAutoMapper(typeof(Program).Assembly);
// Register FluentValidation validators (manual validation only, no auto-validation to support async rules)
builder.Services.AddValidatorsFromAssemblyContaining<SportPlanner.Application.Validators.CreateSubscriptionValidator>();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// --- Setup Supabase/JWT authentication ---------------------------------
var configuration = builder.Configuration;
var supabaseUrl = configuration.GetValue<string>("Supabase:Url");
var supabaseJwtSecret = configuration.GetValue<string>("Supabase:JwtSecret");

// Add DI for user service; middleware will be resolved by UseMiddleware (don't register it as a Scoped service)
// Add DB context using the DefaultConnection connection string
var defaultConn = configuration.GetConnectionString("DefaultConnection");
if (!string.IsNullOrEmpty(defaultConn))
{
    builder.Services.AddDbContext<SportPlanner.Data.AppDbContext>(options =>
        options.UseNpgsql(defaultConn));
}
else
{
    // Fallback for scenarios where a connection string isn't provided; use in-memory DB for tests / convenience
    builder.Services.AddDbContext<SportPlanner.Data.AppDbContext>(options =>
        options.UseInMemoryDatabase("SportPlannerDev"));
}

builder.Services.AddScoped<SportPlanner.Services.IUserService, SportPlanner.Services.UserService>();
// Billing stub
builder.Services.AddScoped<SportPlanner.Services.IBillingService, SportPlanner.Services.BillingServiceStub>();
builder.Services.AddScoped<SportPlanner.Services.ISportConceptService, SportPlanner.Services.SportConceptService>();
builder.Services.AddScoped<SportPlanner.Services.IConceptCategoryService, SportPlanner.Services.ConceptCategoryService>();
// Concept interpretation & team metadata

// Configure authentication for Supabase tokens
builder.Services.AddAuthentication(Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = true;
            if (!string.IsNullOrEmpty(supabaseJwtSecret))
        {
            // Symmetric validation (dev/test). Value comes from Supabase project's JWT secret.
            var key = System.Text.Encoding.UTF8.GetBytes(supabaseJwtSecret);
                options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
            {
                ValidateIssuer = true,
                    ValidIssuers = new[] { supabaseUrl, $"{supabaseUrl?.TrimEnd('/')}/auth/v1" },
                ValidateAudience = true,
                ValidAudience = "authenticated",
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(key),
                ValidateLifetime = true,
                NameClaimType = "sub"
            };
        }
        else if (!string.IsNullOrEmpty(supabaseUrl))
        {
            // Use JWKS discovery if no symmetric secret is configured
            options.MetadataAddress = $"{supabaseUrl.TrimEnd('/')}/auth/v1/.well-known/jwks.json";
            options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
            {
                ValidateIssuer = true,
                    ValidIssuers = new[] { supabaseUrl, $"{supabaseUrl.TrimEnd('/')}/auth/v1" },
                ValidateAudience = true,
                ValidAudience = "authenticated",
                ValidateLifetime = true,
                NameClaimType = "sub"
            };
        }
        else
        {
            // Fallback: still set defaults but warnings in logs will indicate misconfiguration.
            options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                NameClaimType = "sub"
            };
        }
        // Add events to help debugging token validation issues in development
        options.Events = new Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerEvents
        {
            OnMessageReceived = ctx =>
            {
                var logger = ctx.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
                var token = ctx.Request.Headers["Authorization"].FirstOrDefault();
                logger.LogInformation("OnMessageReceived - Raw Authorization header: {AuthHeader}", token);
                return Task.CompletedTask;
            },
            OnAuthenticationFailed = ctx =>
            {
                var logger = ctx.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
                logger.LogError(ctx.Exception, "Authentication failed: {Message}", ctx.Exception.Message);
                return Task.CompletedTask;
            },
            OnTokenValidated = ctx =>
            {
                var logger = ctx.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
                var claims = ctx.Principal?.Claims?.Select(c => new { c.Type, c.Value }).ToArray();
                logger.LogInformation("Token validated. Claims: {@Claims}", claims);
                return Task.CompletedTask;
            }
        };
    });

// CORS policy: allow the frontend dev server to call the API
builder.Services.AddCors(options =>
{
                        options.AddPolicy(name: "AllowLocalhostFrontend",
        policy =>
        {
                        policy.WithOrigins("http://localhost:4200", "http://127.0.0.1:4200", "https://localhost:4200")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

builder.Services.AddAuthorization();

var app = builder.Build();

// Apply pending migrations automatically in Development/Test environments when using Npgsql
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetService<SportPlanner.Data.AppDbContext>();
    try
    {
        if (db != null && db.Database.IsNpgsql())
            db.Database.Migrate();
    }
    catch (Exception ex)
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Error while migrating database on startup");
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// IMPORTANT: UseCors must be called before UseAuthentication/Authorization
app.UseCors("AllowLocalhostFrontend");
app.UseAuthentication();
// Run our middleware after authentication so we can map claims to an application user
app.UseMiddleware<SportPlanner.Middleware.AuthenticatedUserMiddleware>();
app.UseAuthorization();

app.MapControllers();

app.Run();

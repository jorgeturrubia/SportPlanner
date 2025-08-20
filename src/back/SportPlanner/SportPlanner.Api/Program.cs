using AspNetCoreRateLimit;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using SportPlanner.Api.Configuration;
using SportPlanner.Api.Middleware;
using SportPlanner.Api.Services;
using SportPlanner.Api.Validators;
using System.Reflection;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
builder.Host.UseSerilog((context, configuration) => 
    configuration.ReadFrom.Configuration(context.Configuration));
var configuration = builder.Configuration;

// Add services to the container.
builder.Services.AddControllers();

// Add FluentValidation
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddFluentValidationClientsideAdapters();
builder.Services.AddValidatorsFromAssemblyContaining<LoginRequestValidator>();

// Configure CORS from appsettings
var corsSettings = configuration.GetSection("Cors");
builder.Services.AddCors(options =>
{
    options.AddPolicy("DefaultPolicy",
        policy => policy
            .WithOrigins(corsSettings["AllowedOrigins"]?.Split(',') ?? new[] { "http://localhost:4200" })
            .WithMethods(corsSettings["AllowedMethods"]?.Split(',') ?? new[] { "GET", "POST", "PUT", "DELETE", "OPTIONS" })
            .WithHeaders(corsSettings["AllowedHeaders"]?.Split(',') ?? new[] { "Content-Type", "Authorization" })
            .WithExposedHeaders(corsSettings["ExposedHeaders"]?.Split(',') ?? new[] { "X-Total-Count", "X-Page-Number" })
            .SetPreflightMaxAge(TimeSpan.FromSeconds(Convert.ToInt32(corsSettings["MaxAge"] ?? "86400")))
            .AllowCredentials());
});

// Configure JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = configuration["Jwt:Audience"],
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Supabase:JwtSecret"] ?? throw new InvalidOperationException("JWT Secret not configured"))),
            ClockSkew = TimeSpan.FromMinutes(1)
        };
        
        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
                {
                    context.Response.Headers.Add("Token-Expired", "true");
                }
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

// Configure Swagger with JWT support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "SportPlanner API", 
        Version = "v1",
        Description = "API for SportPlanner - Sports Planning Platform"
    });
    
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Register services
builder.Services.AddScoped<IAuthService, SupabaseAuthService>();

// Initialize Supabase client
var supabaseUrl = configuration["Supabase:Url"] ?? throw new InvalidOperationException("Supabase URL not configured");
var supabaseKey = configuration["Supabase:AnonKey"] ?? throw new InvalidOperationException("Supabase Anon Key not configured");
builder.Services.AddSingleton(provider => 
{
    var client = new Supabase.Client(supabaseUrl, supabaseKey, new Supabase.SupabaseOptions
    {
        AutoRefreshToken = true,
        AutoConnectRealtime = false // Set to false for better performance
    });
    client.InitializeAsync().Wait();
    return client;
});

// Configure Rate Limiting
builder.Services.AddRateLimiting(configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseGlobalExceptionMiddleware(); // Add global exception middleware

app.UseSerilogRequestLogging();
app.UseIpRateLimiting();

app.UseHttpsRedirection();

app.UseCors("DefaultPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

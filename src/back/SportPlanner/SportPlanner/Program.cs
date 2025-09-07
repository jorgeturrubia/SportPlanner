using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Options;
using SportPlanner.Data;
using SportPlanner.Middleware;
using SportPlanner.Services;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<SportPlannerDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Supabase configuration
var supabaseUrl = builder.Configuration["Supabase:Url"];
var supabaseKey = builder.Configuration["Supabase:Key"];

if (string.IsNullOrEmpty(supabaseUrl) || string.IsNullOrEmpty(supabaseKey))
{
    throw new InvalidOperationException("Supabase configuration is missing. Please check your appsettings.json");
}

var options = new Supabase.SupabaseOptions
{
    AutoConnectRealtime = true
};

builder.Services.AddSingleton(provider => new Supabase.Client(supabaseUrl, supabaseKey, options));

// Authentication services
builder.Services.AddScoped<ISupabaseService, SupabaseService>();
builder.Services.AddScoped<IUserContextService, UserContextService>();

// Team services
builder.Services.AddScoped<ITeamService, TeamService>();

// Objective services
builder.Services.AddScoped<IObjectiveService, ObjectiveService>();

// Custom Exercise services
builder.Services.AddScoped<ICustomExerciseService, CustomExerciseService>();

// Planning services
builder.Services.AddScoped<IPlanningService, PlanningService>();

// HTTP Context Accessor for UserContextService
builder.Services.AddHttpContextAccessor();

// Using custom JWT middleware only - no ASP.NET Core authentication
// The middleware handles all JWT validation and sets HttpContext.User

builder.Services.AddControllers();

// CORS configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "https://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
              .SetPreflightMaxAge(TimeSpan.FromMinutes(10));
    });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Add security headers middleware
app.UseMiddleware<SecurityHeadersMiddleware>();

// Add global exception handling middleware
app.UseMiddleware<GlobalExceptionMiddleware>();

app.UseCors("AllowAngularApp");

// Add JWT middleware (this handles all authentication)
app.UseMiddleware<JwtMiddleware>();

app.MapControllers();

app.Run();

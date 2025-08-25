using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
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

// JWT Authentication configuration
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = supabaseUrl,
            ValidAudience = "authenticated",
            ClockSkew = TimeSpan.Zero
        };
        
        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = async context =>
            {
                var supabaseService = context.HttpContext.RequestServices.GetRequiredService<ISupabaseService>();
                var token = context.Request.Headers.Authorization.FirstOrDefault()?.Replace("Bearer ", "");
                
                if (!string.IsNullOrEmpty(token))
                {
                    var isValid = await supabaseService.ValidateTokenAsync(token);
                    if (!isValid)
                    {
                        context.Fail("Invalid token");
                    }
                }
            }
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddControllers();

// CORS configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
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

app.UseCors("AllowAngularApp");

// Add JWT middleware
app.UseMiddleware<JwtMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

using Microsoft.EntityFrameworkCore;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
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
                ValidIssuer = supabaseUrl,
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
                ValidIssuer = supabaseUrl,
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
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthentication();
// Run our middleware after authentication so we can map claims to an application user
app.UseMiddleware<SportPlanner.Middleware.AuthenticatedUserMiddleware>();
app.UseAuthorization();

app.MapControllers();

app.Run();

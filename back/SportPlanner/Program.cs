using SportPlanner.Models;
using SportPlanner.Data;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

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

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

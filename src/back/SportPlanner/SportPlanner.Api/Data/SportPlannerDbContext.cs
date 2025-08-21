using Microsoft.EntityFrameworkCore;
using SportPlanner.Api.Models;

namespace SportPlanner.Api.Data;

/// <summary>
/// Entity Framework DbContext for SportPlanner
/// </summary>
public class SportPlannerDbContext : DbContext
{
    public SportPlannerDbContext(DbContextOptions<SportPlannerDbContext> options) 
        : base(options)
    {
    }

    public DbSet<Sport> Sports { get; set; }
    public DbSet<Team> Teams { get; set; }
    public DbSet<TeamMember> TeamMembers { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure Sport entity
        modelBuilder.Entity<Sport>(entity =>
        {
            entity.HasKey(s => s.Id);
            entity.Property(s => s.Name).IsRequired().HasMaxLength(100);
            entity.Property(s => s.Category).IsRequired().HasMaxLength(50);
            entity.Property(s => s.Description).HasMaxLength(500);
            entity.HasIndex(s => s.Name).IsUnique();
        });

        // Configure Team entity
        modelBuilder.Entity<Team>(entity =>
        {
            entity.HasKey(t => t.Id);
            entity.Property(t => t.Name).IsRequired().HasMaxLength(100);
            entity.Property(t => t.Category).IsRequired().HasMaxLength(50);
            entity.Property(t => t.Gender).IsRequired().HasMaxLength(10);
            entity.Property(t => t.Level).IsRequired().HasMaxLength(10);
            entity.Property(t => t.Description).HasMaxLength(500);
            
            // Relationships
            entity.HasOne(t => t.Sport)
                .WithMany(s => s.Teams)
                .HasForeignKey(t => t.SportId)
                .OnDelete(DeleteBehavior.Restrict);

            // Indexes
            entity.HasIndex(t => new { t.Name, t.CreatedByUserId }).IsUnique();
        });

        // Configure TeamMember entity
        modelBuilder.Entity<TeamMember>(entity =>
        {
            entity.HasKey(tm => tm.Id);
            entity.Property(tm => tm.UserName).IsRequired().HasMaxLength(50);
            entity.Property(tm => tm.UserEmail).IsRequired().HasMaxLength(100);
            entity.Property(tm => tm.JerseyNumber).HasMaxLength(20);
            entity.Property(tm => tm.Position).HasMaxLength(50);
            entity.Property(tm => tm.Notes).HasMaxLength(200);

            // Relationships
            entity.HasOne(tm => tm.Team)
                .WithMany(t => t.TeamMembers)
                .HasForeignKey(tm => tm.TeamId)
                .OnDelete(DeleteBehavior.Cascade);

            // Constraints
            entity.HasIndex(tm => new { tm.TeamId, tm.UserId }).IsUnique();
            entity.HasIndex(tm => new { tm.TeamId, tm.JerseyNumber })
                .IsUnique()
                .HasFilter("[JerseyNumber] IS NOT NULL");
        });

        // Configure enum conversions
        modelBuilder.Entity<Team>()
            .Property(t => t.Status)
            .HasConversion<int>();

        modelBuilder.Entity<TeamMember>()
            .Property(tm => tm.Role)
            .HasConversion<int>();

        modelBuilder.Entity<TeamMember>()
            .Property(tm => tm.Status)
            .HasConversion<int>();

        // Seed data for Sports
        SeedSports(modelBuilder);
    }

    private static void SeedSports(ModelBuilder modelBuilder)
    {
        var sports = new[]
        {
            new Sport
            {
                Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                Name = "Fútbol",
                Description = "Deporte de equipo jugado entre dos conjuntos de once jugadores",
                Category = "Deportes de Equipo",
                DefaultMaxPlayers = 25,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Sport
            {
                Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                Name = "Baloncesto",
                Description = "Deporte de equipo jugado entre dos conjuntos de cinco jugadores",
                Category = "Deportes de Equipo",
                DefaultMaxPlayers = 15,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Sport
            {
                Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                Name = "Voleibol",
                Description = "Deporte de equipo jugado entre dos conjuntos de seis jugadores",
                Category = "Deportes de Equipo",
                DefaultMaxPlayers = 12,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Sport
            {
                Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                Name = "Tenis",
                Description = "Deporte individual o de parejas",
                Category = "Deportes Individuales",
                DefaultMaxPlayers = 4,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Sport
            {
                Id = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                Name = "Atletismo",
                Description = "Conjunto de disciplinas deportivas que comprenden carreras, saltos y lanzamientos",
                Category = "Deportes Individuales",
                DefaultMaxPlayers = 30,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        modelBuilder.Entity<Sport>().HasData(sports);
    }
}
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
    public DbSet<Objective> Objectives { get; set; }
    public DbSet<Exercise> Exercises { get; set; }
    public DbSet<ExerciseReview> ExerciseReviews { get; set; }
    public DbSet<ExerciseMedia> ExerciseMedia { get; set; }
    public DbSet<Planning> Plannings { get; set; }
    public DbSet<TrainingSession> TrainingSessions { get; set; }
    public DbSet<PlanningTemplate> PlanningTemplates { get; set; }

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

        // Configure Objective entity
        modelBuilder.Entity<Objective>(entity =>
        {
            entity.HasKey(o => o.Id);
            entity.Property(o => o.Title).IsRequired().HasMaxLength(200);
            entity.Property(o => o.Description).IsRequired().HasMaxLength(1000);
            entity.Property(o => o.TargetAgeGroup).IsRequired().HasMaxLength(100);
            entity.Property(o => o.Sport).IsRequired().HasMaxLength(50);
            entity.Property(o => o.Tags).HasDefaultValue("[]");
            entity.Property(o => o.Prerequisites).HasDefaultValue(null);
            entity.Property(o => o.EquipmentNeeded).HasDefaultValue("[]");
            
            // Enum conversions
            entity.Property(o => o.Category).HasConversion<int>();
            entity.Property(o => o.Difficulty).HasConversion<int>();
            entity.Property(o => o.Status).HasConversion<int>();
            
            // Indexes
            entity.HasIndex(o => o.Category);
            entity.HasIndex(o => o.Sport);
            entity.HasIndex(o => o.IsPublic);
        });

        // Configure Exercise entity
        modelBuilder.Entity<Exercise>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).IsRequired().HasMaxLength(2000);
            entity.Property(e => e.Sport).IsRequired().HasMaxLength(50);
            entity.Property(e => e.SpaceRequired).IsRequired().HasMaxLength(100);
            entity.Property(e => e.TargetAgeGroup).HasDefaultValue("[]");
            entity.Property(e => e.Objectives).HasDefaultValue("[]");
            entity.Property(e => e.Instructions).HasDefaultValue("[]");
            entity.Property(e => e.SafetyNotes).HasDefaultValue("[]");
            entity.Property(e => e.Equipment).HasDefaultValue("[]");
            entity.Property(e => e.Variations).HasDefaultValue("[]");
            entity.Property(e => e.Tags).HasDefaultValue("[]");
            
            // Enum conversions
            entity.Property(e => e.Category).HasConversion<int>();
            entity.Property(e => e.Difficulty).HasConversion<int>();
            entity.Property(e => e.Status).HasConversion<int>();
            
            // Indexes
            entity.HasIndex(e => e.Category);
            entity.HasIndex(e => e.Sport);
            entity.HasIndex(e => e.IsPublic);
            entity.HasIndex(e => e.IsVerified);
        });

        // Configure ExerciseReview entity
        modelBuilder.Entity<ExerciseReview>(entity =>
        {
            entity.HasKey(er => er.Id);
            entity.Property(er => er.UserName).IsRequired().HasMaxLength(100);
            entity.Property(er => er.Comment).IsRequired().HasMaxLength(1000);
            
            // Relationships
            entity.HasOne(er => er.Exercise)
                .WithMany(e => e.Reviews)
                .HasForeignKey(er => er.ExerciseId)
                .OnDelete(DeleteBehavior.Cascade);
            
            // Constraints
            entity.HasIndex(er => new { er.ExerciseId, er.UserId }).IsUnique();
        });

        // Configure ExerciseMedia entity
        modelBuilder.Entity<ExerciseMedia>(entity =>
        {
            entity.HasKey(em => em.Id);
            entity.Property(em => em.Url).IsRequired().HasMaxLength(500);
            entity.Property(em => em.Caption).HasMaxLength(200);
            
            // Enum conversions
            entity.Property(em => em.Type).HasConversion<int>();
            
            // Relationships
            entity.HasOne(em => em.Exercise)
                .WithMany(e => e.Media)
                .HasForeignKey(em => em.ExerciseId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure Planning entity
        modelBuilder.Entity<Planning>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Name).IsRequired().HasMaxLength(200);
            entity.Property(p => p.Description).IsRequired().HasMaxLength(1000);
            entity.Property(p => p.Sport).IsRequired().HasMaxLength(50);
            entity.Property(p => p.Objectives).HasDefaultValue("[]");
            entity.Property(p => p.Tags).HasDefaultValue("[]");
            entity.Property(p => p.TemplateName).HasMaxLength(100);
            
            // Enum conversions
            entity.Property(p => p.Type).HasConversion<int>();
            entity.Property(p => p.Status).HasConversion<int>();
            
            // Relationships
            entity.HasOne(p => p.Team)
                .WithMany()
                .HasForeignKey(p => p.TeamId)
                .OnDelete(DeleteBehavior.Restrict);
            
            // Indexes
            entity.HasIndex(p => p.TeamId);
            entity.HasIndex(p => p.IsTemplate);
            entity.HasIndex(p => p.Status);
        });

        // Configure TrainingSession entity
        modelBuilder.Entity<TrainingSession>(entity =>
        {
            entity.HasKey(ts => ts.Id);
            entity.Property(ts => ts.Name).IsRequired().HasMaxLength(200);
            entity.Property(ts => ts.StartTime).IsRequired().HasMaxLength(10);
            entity.Property(ts => ts.Location).HasMaxLength(200);
            entity.Property(ts => ts.Notes).HasMaxLength(1000);
            entity.Property(ts => ts.CompletionNotes).HasMaxLength(1000);
            entity.Property(ts => ts.Weather).HasMaxLength(100);
            entity.Property(ts => ts.Objectives).HasDefaultValue("[]");
            entity.Property(ts => ts.Exercises).HasDefaultValue("[]");
            entity.Property(ts => ts.Attendance).HasDefaultValue("[]");
            
            // Enum conversions
            entity.Property(ts => ts.Type).HasConversion<int>();
            
            // Relationships
            entity.HasOne(ts => ts.Planning)
                .WithMany(p => p.Sessions)
                .HasForeignKey(ts => ts.PlanningId)
                .OnDelete(DeleteBehavior.Cascade);
            
            // Indexes
            entity.HasIndex(ts => ts.PlanningId);
            entity.HasIndex(ts => ts.Date);
            entity.HasIndex(ts => ts.IsCompleted);
        });

        // Configure PlanningTemplate entity
        modelBuilder.Entity<PlanningTemplate>(entity =>
        {
            entity.HasKey(pt => pt.Id);
            entity.Property(pt => pt.Name).IsRequired().HasMaxLength(200);
            entity.Property(pt => pt.Description).IsRequired().HasMaxLength(1000);
            entity.Property(pt => pt.Sport).IsRequired().HasMaxLength(50);
            entity.Property(pt => pt.TargetLevel).IsRequired().HasMaxLength(50);
            entity.Property(pt => pt.Objectives).HasDefaultValue("[]");
            entity.Property(pt => pt.SessionTemplates).HasDefaultValue("[]");
            
            // Enum conversions
            entity.Property(pt => pt.Type).HasConversion<int>();
            
            // Indexes
            entity.HasIndex(pt => pt.Sport);
            entity.HasIndex(pt => pt.IsPublic);
            entity.HasIndex(pt => pt.Type);
        });

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
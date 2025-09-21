using Microsoft.EntityFrameworkCore;
using SportPlanner.Models;
using SportPlanner.Models.Masters;

namespace SportPlanner.Data;

public class SportPlannerDbContext : DbContext
{
    public SportPlannerDbContext(DbContextOptions<SportPlannerDbContext> options) : base(options)
    {
    }

    // DbSets
    public DbSet<User> Users { get; set; }
    public DbSet<Subscription> Subscriptions { get; set; }
    public DbSet<UserSubscription> UserSubscriptions { get; set; }
    public DbSet<Organization> Organizations { get; set; }
    public DbSet<Team> Teams { get; set; }
    public DbSet<UserTeam> UserTeams { get; set; }

    // Master entities
    public DbSet<Sport> Sports { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<SportGender> SportGenders { get; set; }
    public DbSet<Level> Levels { get; set; }
    public DbSet<Models.Masters.ExerciseCategory> ExerciseCategories { get; set; }
    public DbSet<Models.Masters.Difficulty> Difficulties { get; set; }
    public DbSet<Concept> Concepts { get; set; }
    public DbSet<Exercise> Exercises { get; set; }
    public DbSet<ExerciseConcept> ExerciseConcepts { get; set; }
    public DbSet<ExerciseRating> ExerciseRatings { get; set; }
    public DbSet<Itinerary> Itineraries { get; set; }
    public DbSet<ItineraryConcept> ItineraryConcepts { get; set; }
    public DbSet<ItineraryRating> ItineraryRatings { get; set; }
    public DbSet<Planning> Plannings { get; set; }
    public DbSet<PlanningConcept> PlanningConcepts { get; set; }
    public DbSet<PlanningRating> PlanningRatings { get; set; }
    public DbSet<TrainingSession> TrainingSessions { get; set; }
    public DbSet<SessionExercise> SessionExercises { get; set; }
    public DbSet<Objective> Objectives { get; set; }
    public DbSet<CustomExercise> CustomExercises { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuración de User
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.SupabaseId).IsUnique();
            entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
            entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.SupabaseId).IsRequired().HasMaxLength(100);
            entity.HasOne(e => e.Organization)
                .WithMany()
                .HasForeignKey(e => e.OrganizationId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // Configuración de Subscription
        modelBuilder.Entity<Subscription>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Price).HasColumnType("decimal(10,2)");
        });

        // Configuración de UserSubscription
        modelBuilder.Entity<UserSubscription>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Sport)
                .HasConversion<int>()
                .IsRequired();
            entity.HasOne(e => e.User)
                .WithMany(e => e.Subscriptions)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Subscription)
                .WithMany(e => e.UserSubscriptions)
                .HasForeignKey(e => e.SubscriptionId)
                .OnDelete(DeleteBehavior.Restrict);
            // Optional relationship to Sport master entity
            entity.HasOne(e => e.SportMaster)
                .WithMany(e => e.UserSubscriptions)
                .HasForeignKey(e => e.SportId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // Configuración de Sport
        modelBuilder.Entity<Sport>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.HasIndex(e => e.Name).IsUnique();
        });

        // Configuración de Category
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.HasOne(e => e.Sport)
                .WithMany(e => e.Categories)
                .HasForeignKey(e => e.SportId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => new { e.SportId, e.Name }).IsUnique();
        });

        // Configuración de SportGender
        modelBuilder.Entity<SportGender>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.HasOne(e => e.Sport)
                .WithMany(e => e.SportGenders)
                .HasForeignKey(e => e.SportId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => new { e.SportId, e.Name }).IsUnique();
        });

        // Configuración de Level
        modelBuilder.Entity<Level>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.HasOne(e => e.Sport)
                .WithMany(e => e.Levels)
                .HasForeignKey(e => e.SportId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => new { e.SportId, e.Name }).IsUnique();
        });

        // Configuración de ExerciseCategory
        modelBuilder.Entity<Models.Masters.ExerciseCategory>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.HasIndex(e => e.Name).IsUnique();
        });

        // Configuración de Difficulty
        modelBuilder.Entity<Models.Masters.Difficulty>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.HasIndex(e => e.Name).IsUnique();
        });

        // Configuración de Organization
        modelBuilder.Entity<Organization>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.HasOne(e => e.CreatedBy)
                .WithMany(e => e.CreatedOrganizations)
                .HasForeignKey(e => e.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configuración de Team
        modelBuilder.Entity<Team>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);

            // Foreign key relationships to master entities
            entity.HasOne(e => e.Sport)
                .WithMany()
                .HasForeignKey(e => e.SportId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Category)
                .WithMany()
                .HasForeignKey(e => e.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.SportGender)
                .WithMany()
                .HasForeignKey(e => e.SportGenderId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Level)
                .WithMany()
                .HasForeignKey(e => e.LevelId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Organization)
                .WithMany(e => e.Teams)
                .HasForeignKey(e => e.OrganizationId)
                .OnDelete(DeleteBehavior.SetNull);
            entity.HasOne(e => e.CreatedBy)
                .WithMany()
                .HasForeignKey(e => e.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Indexes for performance
            entity.HasIndex(e => e.SportId);
            entity.HasIndex(e => e.CategoryId);
            entity.HasIndex(e => e.SportGenderId);
            entity.HasIndex(e => e.LevelId);
        });

        // Configuración de UserTeam
        modelBuilder.Entity<UserTeam>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.User)
                .WithMany(e => e.UserTeams)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Team)
                .WithMany(e => e.UserTeams)
                .HasForeignKey(e => e.TeamId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => new { e.UserId, e.TeamId }).IsUnique();
        });

        // Configuración de Concept
        modelBuilder.Entity<Concept>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Category).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Subcategory).IsRequired().HasMaxLength(100);
            entity.HasOne(e => e.CreatedBy)
                .WithMany()
                .HasForeignKey(e => e.CreatedByUserId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // Configuración de Exercise
        modelBuilder.Entity<Exercise>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.AverageRating).HasColumnType("decimal(3,2)");
            entity.HasOne(e => e.CreatedBy)
                .WithMany()
                .HasForeignKey(e => e.CreatedByUserId)
                .OnDelete(DeleteBehavior.SetNull);
            entity.HasOne(e => e.ExerciseCategory)
                .WithMany(e => e.Exercises)
                .HasForeignKey(e => e.ExerciseCategoryId)
                .OnDelete(DeleteBehavior.SetNull);
            entity.HasOne(e => e.Difficulty)
                .WithMany(e => e.Exercises)
                .HasForeignKey(e => e.DifficultyId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // Configuración de ExerciseConcept (tabla de unión)
        modelBuilder.Entity<ExerciseConcept>(entity =>
        {
            entity.HasKey(e => new { e.ExerciseId, e.ConceptId });
            entity.HasOne(e => e.Exercise)
                .WithMany(e => e.ExerciseConcepts)
                .HasForeignKey(e => e.ExerciseId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Concept)
                .WithMany(e => e.ExerciseConcepts)
                .HasForeignKey(e => e.ConceptId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configuración de ExerciseRating
        modelBuilder.Entity<ExerciseRating>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Exercise)
                .WithMany(e => e.Ratings)
                .HasForeignKey(e => e.ExerciseId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => new { e.ExerciseId, e.UserId }).IsUnique();
        });

        // Configuración de Itinerary
        modelBuilder.Entity<Itinerary>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Sport).IsRequired().HasMaxLength(50);
            entity.Property(e => e.AverageRating).HasColumnType("decimal(3,2)");
            entity.HasOne(e => e.CreatedBy)
                .WithMany()
                .HasForeignKey(e => e.CreatedByUserId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // Configuración de ItineraryConcept
        modelBuilder.Entity<ItineraryConcept>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Itinerary)
                .WithMany(e => e.ItineraryConcepts)
                .HasForeignKey(e => e.ItineraryId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Concept)
                .WithMany(e => e.ItineraryConcepts)
                .HasForeignKey(e => e.ConceptId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configuración de ItineraryRating
        modelBuilder.Entity<ItineraryRating>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Itinerary)
                .WithMany(e => e.Ratings)
                .HasForeignKey(e => e.ItineraryId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => new { e.ItineraryId, e.UserId }).IsUnique();
        });

        // Configuración de Planning
        modelBuilder.Entity<Planning>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(1000);
            
            // Configure enum properties
            entity.Property(e => e.Type)
                .HasConversion<int>()
                .IsRequired();
            
            entity.Property(e => e.Status)
                .HasConversion<int>()
                .IsRequired();
            
            // Configure TrainingDays as JSON
            entity.Property(e => e.TrainingDays)
                .HasConversion(
                    v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                    v => System.Text.Json.JsonSerializer.Deserialize<List<Models.DayOfWeek>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<Models.DayOfWeek>()
                );
            
            // Configure Tags as JSON
            entity.Property(e => e.Tags)
                .HasConversion(
                    v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                    v => System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<string>()
                );
            
            // Foreign key relationships
            entity.HasOne(e => e.CreatedBy)
                .WithMany()
                .HasForeignKey(e => e.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);
                
            entity.HasOne(e => e.Team)
                .WithMany()
                .HasForeignKey(e => e.TeamId)
                .OnDelete(DeleteBehavior.SetNull);
                
            // Indexes for performance
            entity.HasIndex(e => e.CreatedByUserId);
            entity.HasIndex(e => e.TeamId);
            entity.HasIndex(e => e.Type);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.IsActive);
            entity.HasIndex(e => e.IsPublic);
            entity.HasIndex(e => e.StartDate);
            entity.HasIndex(e => e.EndDate);
        });


        // Configuración de PlanningConcept
        modelBuilder.Entity<PlanningConcept>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Planning)
                .WithMany(e => e.PlanningConcepts)
                .HasForeignKey(e => e.PlanningId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Concept)
                .WithMany(e => e.PlanningConcepts)
                .HasForeignKey(e => e.ConceptId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configuración de PlanningRating
        modelBuilder.Entity<PlanningRating>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Planning)
                .WithMany(e => e.Ratings)
                .HasForeignKey(e => e.PlanningId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => new { e.PlanningId, e.UserId }).IsUnique();
        });

        // Configuración de TrainingSession
        modelBuilder.Entity<TrainingSession>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.HasOne(e => e.Planning)
                .WithMany(e => e.TrainingSessions)
                .HasForeignKey(e => e.PlanningId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.CreatedBy)
                .WithMany()
                .HasForeignKey(e => e.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configuración de SessionExercise
        modelBuilder.Entity<SessionExercise>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Session)
                .WithMany(e => e.SessionExercises)
                .HasForeignKey(e => e.SessionId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Exercise)
                .WithMany(e => e.SessionExercises)
                .HasForeignKey(e => e.ExerciseId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configuración de Objective
        modelBuilder.Entity<Objective>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.Tags)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList()
                );
            entity.HasOne(e => e.Team)
                .WithMany()
                .HasForeignKey(e => e.TeamId)
                .OnDelete(DeleteBehavior.SetNull);
            entity.HasOne(e => e.CreatedBy)
                .WithMany()
                .HasForeignKey(e => e.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configuración de CustomExercise
        modelBuilder.Entity<CustomExercise>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.Instructions).HasMaxLength(2000);
            entity.Property(e => e.Equipment).HasMaxLength(500);
            entity.Property(e => e.Tags)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList()
                );
            entity.HasOne(e => e.CreatedBy)
                .WithMany()
                .HasForeignKey(e => e.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Datos iniciales de suscripciones
        SeedData(modelBuilder);
    }

    private static void SeedData(ModelBuilder modelBuilder)
    {
        // Suscripciones por defecto
        modelBuilder.Entity<Subscription>().HasData(
            new Subscription
            {
                Id = 1,
                Name = "Gratuita",
                Type = SubscriptionType.Free,
                Price = 0,
                Description = "Plan gratuito con funcionalidades básicas",
                MaxTeams = 1,
                MaxTrainingSessions = 15,
                CanCreateCustomConcepts = false,
                CanCreateItineraries = false,
                HasDirectorMode = false,
                IsActive = true
            },
            new Subscription
            {
                Id = 2,
                Name = "Entrenador",
                Type = SubscriptionType.Coach,
                Price = 29.99m,
                Description = "Plan para entrenadores individuales",
                MaxTeams = 5,
                MaxTrainingSessions = -1, // Ilimitado
                CanCreateCustomConcepts = true,
                CanCreateItineraries = true,
                HasDirectorMode = false,
                IsActive = true
            },
            new Subscription
            {
                Id = 3,
                Name = "Club",
                Type = SubscriptionType.Club,
                Price = 99.99m,
                Description = "Plan completo para clubes y organizaciones",
                MaxTeams = -1, // Ilimitado
                MaxTrainingSessions = -1, // Ilimitado
                CanCreateCustomConcepts = true,
                CanCreateItineraries = true,
                HasDirectorMode = true,
                IsActive = true
            }
        );
    }
}

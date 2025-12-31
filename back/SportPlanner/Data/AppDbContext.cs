using Microsoft.EntityFrameworkCore;
using SportPlanner.Models;

namespace SportPlanner.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<ApplicationUser> Users { get; set; } = null!;
    public DbSet<Sport> Sports { get; set; } = null!;
    public DbSet<SubscriptionPlan> SubscriptionPlans { get; set; } = null!;
    public DbSet<Subscription> Subscriptions { get; set; } = null!;
    public DbSet<SubscriptionHistory> SubscriptionHistories { get; set; } = null!;
    public DbSet<Organization> Organizations { get; set; } = null!;
    public DbSet<OrganizationMembership> OrganizationMemberships { get; set; } = null!;
    public DbSet<Team> Teams { get; set; } = null!;
    public DbSet<TeamMember> TeamMembers { get; set; } = null!;
    public DbSet<TeamSeason> TeamSeasons { get; set; } = null!;
    public DbSet<ConceptCategory> ConceptCategories { get; set; } = null!;
    public DbSet<DifficultyLevel> DifficultyLevels { get; set; } = null!;
    public DbSet<Season> Seasons { get; set; } = null!;
    public DbSet<SportConcept> SportConcepts { get; set; } = null!;
    public DbSet<PlanConcept> PlanConcepts { get; set; } = null!;
    public DbSet<Planning> Plannings { get; set; } = null!;
    public DbSet<PlaningScheduleDay> TrainingScheduleDays { get; set; } = null!;
    public DbSet<Court> Courts { get; set; } = null!;
    public DbSet<TeamCategory> TeamCategories { get; set; } = null!;
    public DbSet<TeamLevel> TeamLevels { get; set; } = null!;
    public DbSet<PlanningTemplate> PlanningTemplates { get; set; } = null!;
    public DbSet<MethodologicalItinerary> MethodologicalItineraries { get; set; } = null!;
    public DbSet<Exercise> Exercises { get; set; } = null!;
    public DbSet<TrainingSession> TrainingSessions { get; set; } = null!;
    public DbSet<TrainingSessionConcept> TrainingSessionConcepts { get; set; } = null!;
    public DbSet<TrainingSessionExercise> TrainingSessionExercises { get; set; } = null!;
    public DbSet<MethodologicalItineraryRating> MethodologicalItineraryRatings { get; set; } = null!;



    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<ApplicationUser>().HasKey(u => u.SupabaseId);

        modelBuilder.Entity<Sport>().HasKey(s => s.Id);
        modelBuilder.Entity<Sport>().HasIndex(s => s.Name).IsUnique();

        modelBuilder.Entity<SubscriptionPlan>().HasKey(p => p.Id);

        modelBuilder.Entity<Subscription>().HasKey(s => s.Id);
        modelBuilder.Entity<Subscription>()
            .HasOne(s => s.User)
            .WithMany()
            .HasForeignKey(s => s.UserSupabaseId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<Subscription>()
            .HasOne(s => s.Organization)
            .WithMany()
            .HasForeignKey(s => s.OrganizationId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<Subscription>()
            .HasOne(s => s.Plan)
            .WithMany()
            .HasForeignKey(s => s.PlanId)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Subscription>()
            .HasOne(s => s.Sport)
            .WithMany()
            .HasForeignKey(s => s.SportId)
            .OnDelete(DeleteBehavior.Restrict);

        // Enforce only user or org set, not both and not neither
        modelBuilder.Entity<Subscription>()
            .ToTable(t => t.HasCheckConstraint("CK_Subscription_UserOrOrg", "(\"UserSupabaseId\" IS NOT NULL) != (\"OrganizationId\" IS NOT NULL)"));

        // Unique active subscription per user + sport
        modelBuilder.Entity<Subscription>()
            .HasIndex(s => new { s.UserSupabaseId, s.SportId })
            .HasDatabaseName("IX_Subscription_User_Sport_Active")
            .HasFilter("\"IsActive\" = TRUE AND \"UserSupabaseId\" IS NOT NULL")
            .IsUnique();

        // Unique active subscription per organization + sport
        modelBuilder.Entity<Subscription>()
            .HasIndex(s => new { s.OrganizationId, s.SportId })
            .HasDatabaseName("IX_Subscription_Org_Sport_Active")
            .HasFilter("\"IsActive\" = TRUE AND \"OrganizationId\" IS NOT NULL")
            .IsUnique();

        modelBuilder.Entity<SubscriptionHistory>().HasKey(sh => sh.Id);

        modelBuilder.Entity<Organization>().HasKey(o => o.Id);

        modelBuilder.Entity<OrganizationMembership>().HasKey(m => m.Id);
        modelBuilder.Entity<OrganizationMembership>()
            .HasIndex(m => new { m.OrganizationId, m.UserSupabaseId })
            .IsUnique();

        modelBuilder.Entity<Team>().HasKey(t => t.Id);
        modelBuilder.Entity<TeamMember>().HasKey(tm => tm.Id);
        modelBuilder.Entity<TeamMember>()
            .HasIndex(tm => new { tm.TeamId, tm.UserSupabaseId })
            .IsUnique();

        modelBuilder.Entity<TeamSeason>().HasKey(ts => ts.Id);
        modelBuilder.Entity<TeamSeason>()
            .HasIndex(ts => new { ts.TeamId, ts.SeasonId })
            .IsUnique();
        modelBuilder.Entity<TeamSeason>()
            .HasOne(ts => ts.Team)
            .WithMany(t => t.TeamSeasons)
            .HasForeignKey(ts => ts.TeamId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<TeamSeason>()
            .HasOne(ts => ts.Season)
            .WithMany(s => s.TeamSeasons)
            .HasForeignKey(ts => ts.SeasonId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ConceptCategory>().HasKey(c => c.Id);
        modelBuilder.Entity<ConceptCategory>()
            .HasOne(c => c.Parent)
            .WithMany(c => c.SubCategories)
            .HasForeignKey(c => c.ParentId)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<ConceptCategory>()
            .HasIndex(c => c.OwnerId);
        modelBuilder.Entity<ConceptCategory>()
            .HasOne(c => c.OriginSystem)
            .WithMany()
            .HasForeignKey(c => c.OriginSystemId)
            .OnDelete(DeleteBehavior.SetNull);



        modelBuilder.Entity<DifficultyLevel>().HasKey(dl => dl.Id);

        modelBuilder.Entity<SportConcept>().HasKey(sc => sc.Id);
        modelBuilder.Entity<SportConcept>()
            .HasIndex(sc => new { sc.Name, sc.SportId })
            .IsUnique(false);
        modelBuilder.Entity<SportConcept>()
            .HasIndex(sc => sc.OwnerId);
        modelBuilder.Entity<SportConcept>()
            .HasOne(sc => sc.OriginSystem)
            .WithMany()
            .HasForeignKey(sc => sc.OriginSystemId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<PlanConcept>().HasKey(pc => pc.Id);
        modelBuilder.Entity<PlanConcept>()
            .HasIndex(pc => new { pc.PlanningId, pc.SportConceptId })
            .IsUnique(true);
        modelBuilder.Entity<PlanConcept>()
            .HasOne(pc => pc.Planning)
            .WithMany(ts => ts.PlanConcepts)
            .HasForeignKey(pc => pc.PlanningId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<PlanConcept>()
            .HasOne(pc => pc.SportConcept)
            .WithMany()
            .HasForeignKey(pc => pc.SportConceptId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Planning>().HasKey(ts => ts.Id);
        modelBuilder.Entity<Planning>()
            .HasOne(ts => ts.Team)
            .WithMany(t => t.Plannings)
            .HasForeignKey(ts => ts.TeamId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<PlaningScheduleDay>().HasKey(tds => tds.Id);
        modelBuilder.Entity<PlaningScheduleDay>()
            .HasIndex(tds => new { tds.PlanningId, tds.DayOfWeek })
            .IsUnique(true);
        modelBuilder.Entity<PlaningScheduleDay>()
            .HasOne(tds => tds.Planning)
            .WithMany(ts => ts.ScheduleDays)
            .HasForeignKey(tds => tds.PlanningId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<PlaningScheduleDay>()
            .HasOne(tds => tds.Court)
            .WithMany()
            .HasForeignKey(tds => tds.CourtId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Court>().HasKey(c => c.Id);


        modelBuilder.Entity<TeamCategory>().HasKey(tc => tc.Id);

        modelBuilder.Entity<TeamLevel>().HasKey(tl => tl.Id);


        // MethodologicalItinerary configuration
        modelBuilder.Entity<MethodologicalItinerary>().HasKey(mi => mi.Id);
        modelBuilder.Entity<MethodologicalItinerary>()
            .HasOne(mi => mi.Sport)
            .WithMany()
            .HasForeignKey(mi => mi.SportId)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<MethodologicalItinerary>()
            .HasOne(mi => mi.SystemSource)
            .WithMany()
            .HasForeignKey(mi => mi.SystemSourceId)
            .OnDelete(DeleteBehavior.SetNull);

        // PlanningTemplate configuration
        modelBuilder.Entity<PlanningTemplate>().HasKey(mi => mi.Id);
        modelBuilder.Entity<PlanningTemplate>()
            .HasIndex(mi => mi.Code)
            .IsUnique();
        modelBuilder.Entity<PlanningTemplate>()
            .HasOne(mi => mi.ParentTemplate)
            .WithMany(mi => mi.ChildTemplates)
            .HasForeignKey(mi => mi.ParentTemplateId)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<PlanningTemplate>()
            .HasOne(mi => mi.SystemSource)
            .WithMany()
            .HasForeignKey(mi => mi.SystemSourceId)
            .OnDelete(DeleteBehavior.SetNull);
        modelBuilder.Entity<PlanningTemplate>()
            .HasOne(mi => mi.MethodologicalItinerary)
            .WithMany(mi => mi.PlanningTemplates)
            .HasForeignKey(mi => mi.MethodologicalItineraryId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<TeamSeason>()
            .HasOne(ts => ts.TeamCategory)
            .WithMany()
            .HasForeignKey(ts => ts.TeamCategoryId)
            .OnDelete(DeleteBehavior.SetNull);

        // PlanningTemplateConcept configuration (M:N)
        modelBuilder.Entity<PlanningTemplateConcept>()
            .HasOne(ic => ic.PlanningTemplate)
            .WithMany(mi => mi.TemplateConcepts)
            .HasForeignKey(ic => ic.PlanningTemplateId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<PlanningTemplateConcept>()
            .HasOne(ic => ic.SportConcept)
            .WithMany()
            .HasForeignKey(ic => ic.SportConceptId)
            .OnDelete(DeleteBehavior.Cascade);
        
        // MethodologicalItineraryRatings configuration
        modelBuilder.Entity<MethodologicalItineraryRating>().HasKey(ir => ir.Id);
        modelBuilder.Entity<MethodologicalItineraryRating>()
            .HasIndex(ir => new { ir.MethodologicalItineraryId, ir.UserId })
            .IsUnique();
        modelBuilder.Entity<MethodologicalItineraryRating>()
            .HasOne(ir => ir.MethodologicalItinerary)
            .WithMany()
            .HasForeignKey(ir => ir.MethodologicalItineraryId)
            .OnDelete(DeleteBehavior.Cascade);

        // Exercise and SportConcept Many-to-Many
        modelBuilder.Entity<Exercise>()
            .HasMany(e => e.Concepts)
            .WithMany(sc => sc.Exercises)
            .UsingEntity(j => j.ToTable("ExerciseConcepts"));
        modelBuilder.Entity<Exercise>()
            .HasIndex(e => e.OwnerId);
        modelBuilder.Entity<Exercise>()
            .HasOne(e => e.OriginSystem)
            .WithMany()
            .HasForeignKey(e => e.OriginSystemId)
            .OnDelete(DeleteBehavior.SetNull);

        // TrainingSession configuration
        modelBuilder.Entity<TrainingSession>().HasKey(ts => ts.Id);
        modelBuilder.Entity<TrainingSession>()
            .HasOne(ts => ts.Team)
            .WithMany()
            .HasForeignKey(ts => ts.TeamId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TrainingSessionConcept>().HasKey(tsc => tsc.Id);
        modelBuilder.Entity<TrainingSessionConcept>()
            .HasOne(tsc => tsc.TrainingSession)
            .WithMany(ts => ts.SessionConcepts)
            .HasForeignKey(tsc => tsc.TrainingSessionId);
        modelBuilder.Entity<TrainingSessionConcept>()
            .HasOne(tsc => tsc.SportConcept)
            .WithMany()
            .HasForeignKey(tsc => tsc.SportConceptId);

        modelBuilder.Entity<TrainingSessionExercise>().HasKey(tse => tse.Id);
        modelBuilder.Entity<TrainingSessionExercise>()
            .HasOne(tse => tse.TrainingSession)
            .WithMany(ts => ts.SessionExercises)
            .HasForeignKey(tse => tse.TrainingSessionId);
        modelBuilder.Entity<TrainingSessionExercise>()
            .HasOne(tse => tse.Exercise)
            .WithMany()
            .HasForeignKey(tse => tse.ExerciseId);
        modelBuilder.Entity<TrainingSessionExercise>()
            .HasOne(tse => tse.SportConcept)
            .WithMany()
            .HasForeignKey(tse => tse.SportConceptId);
    }
}

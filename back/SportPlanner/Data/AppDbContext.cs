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
    public DbSet<ConceptCategory> ConceptCategories { get; set; } = null!;
    public DbSet<ConceptPhase> ConceptPhases { get; set; } = null!;
    public DbSet<DifficultyLevel> DifficultyLevels { get; set; } = null!;
    public DbSet<SportConcept> SportConcepts { get; set; } = null!;
    public DbSet<PlanConcept> PlanConcepts { get; set; } = null!;
    public DbSet<TrainingSchedule> TrainingSchedules { get; set; } = null!;
    public DbSet<TrainingScheduleDay> TrainingScheduleDays { get; set; } = null!;
    public DbSet<Court> Courts { get; set; } = null!;
    public DbSet<TrainingSession> TrainingSessions { get; set; } = null!;
    public DbSet<SessionConcept> SessionConcepts { get; set; } = null!;

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

        modelBuilder.Entity<ConceptCategory>().HasKey(c => c.Id);

        modelBuilder.Entity<ConceptPhase>().HasKey(cp => cp.Id);

        modelBuilder.Entity<DifficultyLevel>().HasKey(dl => dl.Id);

        modelBuilder.Entity<SportConcept>().HasKey(sc => sc.Id);
        modelBuilder.Entity<SportConcept>()
            .HasIndex(sc => new { sc.Name, sc.SportId })
            .IsUnique(false);

        modelBuilder.Entity<PlanConcept>().HasKey(pc => pc.Id);
        modelBuilder.Entity<PlanConcept>()
            .HasIndex(pc => new { pc.TrainingScheduleId, pc.SportConceptId })
            .IsUnique(true);
        modelBuilder.Entity<PlanConcept>()
            .HasOne(pc => pc.TrainingSchedule)
            .WithMany(ts => ts.PlanConcepts)
            .HasForeignKey(pc => pc.TrainingScheduleId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<PlanConcept>()
            .HasOne(pc => pc.SportConcept)
            .WithMany()
            .HasForeignKey(pc => pc.SportConceptId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<TrainingSchedule>().HasKey(ts => ts.Id);
        modelBuilder.Entity<TrainingSchedule>()
            .HasOne(ts => ts.Team)
            .WithMany(t => t.TrainingSchedules)
            .HasForeignKey(ts => ts.TeamId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TrainingScheduleDay>().HasKey(tds => tds.Id);
        modelBuilder.Entity<TrainingScheduleDay>()
            .HasIndex(tds => new { tds.TrainingScheduleId, tds.DayOfWeek })
            .IsUnique(true);
        modelBuilder.Entity<TrainingScheduleDay>()
            .HasOne(tds => tds.TrainingSchedule)
            .WithMany(ts => ts.ScheduleDays)
            .HasForeignKey(tds => tds.TrainingScheduleId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<TrainingScheduleDay>()
            .HasOne(tds => tds.Court)
            .WithMany()
            .HasForeignKey(tds => tds.CourtId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Court>().HasKey(c => c.Id);

        modelBuilder.Entity<TrainingSession>().HasKey(ts => ts.Id);
        modelBuilder.Entity<TrainingSession>()
            .HasOne(ts => ts.TrainingSchedule)
            .WithMany()
            .HasForeignKey(ts => ts.TrainingScheduleId)
            .OnDelete(DeleteBehavior.SetNull);
        modelBuilder.Entity<TrainingSession>()
            .HasOne(ts => ts.Court)
            .WithMany()
            .HasForeignKey(ts => ts.CourtId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<SessionConcept>().HasKey(sc => sc.Id);
        modelBuilder.Entity<SessionConcept>()
            .HasIndex(sc => new { sc.TrainingSessionId, sc.Order })
            .IsUnique(true);
        modelBuilder.Entity<SessionConcept>()
            .HasOne(sc => sc.TrainingSession)
            .WithMany(ts => ts.SessionConcepts)
            .HasForeignKey(sc => sc.TrainingSessionId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<SessionConcept>()
            .HasOne(sc => sc.SportConcept)
            .WithMany()
            .HasForeignKey(sc => sc.SportConceptId)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<SessionConcept>()
            .HasOne(sc => sc.PlanConcept)
            .WithMany()
            .HasForeignKey(sc => sc.PlanConceptId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}

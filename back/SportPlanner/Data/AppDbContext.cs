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
            .HasCheckConstraint("CK_Subscription_UserOrOrg", "(\"UserSupabaseId\" IS NOT NULL) != (\"OrganizationId\" IS NOT NULL)");

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
    }
}

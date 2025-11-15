using Microsoft.EntityFrameworkCore;
using SportPlanner.Models;

namespace SportPlanner.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }
    public DbSet<SportPlanner.Models.User> Users => Set<SportPlanner.Models.User>();

}

using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace Hootify.DbModel;

public class AppDbContext : DbContext
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AppDbContext(DbContextOptions<AppDbContext> options, IHttpContextAccessor httpContextAccessor) :
        base(options)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public DbSet<Category> Categories { get; set; }
    public DbSet<Game> Games { get; set; }
    public DbSet<Player> Players { get; set; }
    public DbSet<Question> Questions { get; set; }
    public DbSet<Quiz> Quizzes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Global query filter
        var idString = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        Guid.TryParse(idString, out var userId);
        modelBuilder.Entity<Quiz>().HasQueryFilter(e => e.UserId == userId);
        modelBuilder.Entity<Question>().HasQueryFilter(e => e.UserId == userId);
        /*modelBuilder.Entity<Category>().HasQueryFilter(e => e.UserId == userId);*/
        base.OnModelCreating(modelBuilder);
    }
}
using System.Security.Authentication;
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
    public DbSet<GameAnswer> GameAnswers { get; set; }
    public DbSet<Player> Players { get; set; }
    public DbSet<Question> Questions { get; set; }
    public DbSet<Quiz> Quizzes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Global query filter
        modelBuilder.Entity<Quiz>().HasQueryFilter(e => e.UserId == GetUserId());
        modelBuilder.Entity<Question>().HasQueryFilter(e => e.UserId == GetUserId());
        modelBuilder.Entity<Category>().HasQueryFilter(e => e.UserId == GetUserId());
    }

    private Guid GetUserId()
    {
        var idString = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
        try
        {
            return Guid.Parse(idString!);
        }
        catch (Exception e)
        {
            throw new AuthenticationException(e.Message);
        }
    }
}
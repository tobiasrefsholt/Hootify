using System.Security.Claims;
using Hootify.DbModel;

namespace Hootify.ApplicationServices;

public abstract class DashboardService
{
    private readonly HttpContext _httpContext;
    protected readonly AppDbContext DbContext;
    protected readonly Guid UserId;

    protected DashboardService(AppDbContext dbContext, HttpContext httpContext)
    {
        _httpContext = httpContext;
        DbContext = dbContext;
        UserId = GetUserId();
    }

    private Guid GetUserId()
    {
        var success = Guid.TryParse(_httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId);
        if (!success) throw new Exception("User not found");
        return userId;
    }
}
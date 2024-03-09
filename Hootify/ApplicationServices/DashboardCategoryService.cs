using Hootify.DbModel;

namespace Hootify.ApplicationServices;

public class DashboardCategoryService(AppDbContext dbContext, HttpContext httpContext)
    : DashboardService(dbContext, httpContext)
{
    public void Add(ViewModel.Category category)
    {
        var dbCategory = new Category
        {
            Id = Guid.NewGuid(),
            UserId = UserId,
            Name = category.Name
        };
        DbContext.Categories.Add(dbCategory);
        DbContext.SaveChanges();
    }

    public List<ViewModel.Category> GetAll()
    {
        var dbCategories =  DbContext.Categories
            .Where(c => c.UserId == UserId)
            .ToList<Category>();
        return dbCategories.Select(c => new ViewModel.Category
        {
            Id = c.Id,
            Name = c.Name
        }).ToList();
    }

    public void Update(ViewModel.Category category)
    {
        var dbCategory = DbContext.Categories
            .Where(c => c.UserId == UserId)
            .FirstOrDefault(e => e.Id == category.Id);
        if (dbCategory == null) return;
        dbCategory.Name = category.Name;
        DbContext.SaveChanges();
    }

    public void Delete(Guid id)
    {
        var dbCategory = DbContext.Categories
            .Where(c => c.UserId == UserId)
            .FirstOrDefault(c => c.Id == id);
        if (dbCategory == null) return;
        DbContext.Categories.Remove(dbCategory);
        DbContext.SaveChanges();
    }
}
using System.Security.Claims;
using Hootify.DbModel;

namespace Hootify.ApplicationServices;

public class DashboardCategoryService
{
    AppDbContext _dbContext;

    public DashboardCategoryService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public void Add(ViewModel.Category category, Guid userId)
    {
        var dbcategory = new Category
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Name = category.Name
        };
        _dbContext.Categories.Add(dbcategory);
        _dbContext.SaveChanges();
    }

    public ViewModel.Category? Get(Guid id)
    {
        var dbCategory = _dbContext.Categories.FirstOrDefault(e => e.Id == id);
        if (dbCategory == null) return null;
        return new ViewModel.Category
        {
            Id = dbCategory.Id,
            Name = dbCategory.Name
        };
    }

    public List<ViewModel.Category> GetAll()
    {
        var dbCategories =  _dbContext.Categories.ToList<Category>();
        return dbCategories.Select(c => new ViewModel.Category
        {
            Id = c.Id,
            Name = c.Name
        }).ToList();
    }

    public void Update(ViewModel.Category category)
    {
        var dbCategory = _dbContext.Categories.FirstOrDefault(e => e.Id == category.Id);
        dbCategory.Name = category.Name;
        _dbContext.SaveChanges();
    }

    public void Delete(Guid id)
    {
        var dbCategory = _dbContext.Categories.FirstOrDefault(c => c.Id == id);
        if (dbCategory == null) return;
        _dbContext.Categories.Remove(dbCategory);
        _dbContext.SaveChanges();
    }
}
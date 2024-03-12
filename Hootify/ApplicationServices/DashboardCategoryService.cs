using Hootify.DbModel;
using Microsoft.EntityFrameworkCore;

namespace Hootify.ApplicationServices;

public class DashboardCategoryService(AppDbContext dbContext, HttpContext httpContext)
    : DashboardService(dbContext, httpContext)
{
    public async Task<bool> Add(ViewModel.Category category)
    {
        var dbCategory = new Category(Guid.NewGuid(), UserId, category.Name);
        DbContext.Categories.Add(dbCategory);
        var changes = await DbContext.SaveChangesAsync();
        return changes > 0;
    }

    public async Task<List<ViewModel.Category>> GetAll()
    {
        return await DbContext.Categories
            .Where(c => c.UserId == UserId)
            .Select(c => new ViewModel.Category(c.Id, c.Name))
            .ToListAsync();
    }

    public async Task<bool> Update(ViewModel.Category category)
    {
        var dbCategory = await DbContext.Categories
            .Where(c => c.UserId == UserId)
            .FirstOrDefaultAsync(e => e.Id == category.Id);
        if (dbCategory == null) return false;
        dbCategory.Name = category.Name;
        var changes = await DbContext.SaveChangesAsync();
        return changes > 0;
    }

    public async Task<bool> Delete(Guid[] ids)
    {
        var dbCategories = await DbContext.Categories
            .Where(c => c.UserId == UserId)
            .Where(c => ids.Contains(c.Id))
            .ToListAsync();

        var questions = await DbContext.Questions
            .Where(q => q.UserId == UserId)
            .Where(q => ids.Contains(q.CategoryId))
            .ToListAsync();

        DbContext.Categories.RemoveRange(dbCategories);
        DbContext.Questions.RemoveRange(questions);
        var changes = await DbContext.SaveChangesAsync();
        return changes > 0;
    }
}
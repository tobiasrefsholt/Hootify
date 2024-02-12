using Hootify.DbModel;

namespace Hootify.Infrastructure;

public class SQLCategoryData
{
    private AppDbContext _context;
    public SQLCategoryData(AppDbContext context)
    {
        _context = context;
    }
    public void Add(Category emp)
    {
        _context.Add(emp);
        _context.SaveChanges();
    }
    public Category Get(Guid ID)
    {
        return _context.Categories.FirstOrDefault(e => e.Id == ID);
    }
    public IEnumerable<Category> GetAll()
    {
        return _context.Categories.ToList<Category>();
    }
    
}
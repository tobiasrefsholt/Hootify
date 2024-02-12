using System.Security.AccessControl;
using Hootify.DbModel;

namespace Hootify.Infrastructure;

public class SQLQuizzesData
{
    private AppDbContext _context;
    public SQLQuizzesData(AppDbContext context)
    {
        _context = context;
    }
    public void Add(Quiz emp)
    {
        _context.Add(emp);
        _context.SaveChanges();
    }
    public Quiz Get(Guid ID)
    {
        return _context.Quizzes.FirstOrDefault(e => e.Id == ID);
    }
    public IEnumerable<Quiz> GetAll()
    {
        return _context.Quizzes.ToList<Quiz>();
    }
}
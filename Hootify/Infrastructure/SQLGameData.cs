using Hootify.DbModel;

namespace Hootify.Infrastructure;

public class SQLGameData
{
    private AppDbContext _context;
    public SQLGameData(AppDbContext context)
    {
        _context = context;
    }
    public void Add(Game emp)
    {
        _context.Add(emp);
        _context.SaveChanges();
    }
    public Game Get(Guid ID)
    {
        return _context.Games.FirstOrDefault(e => e.Id == ID);
    }
    public IEnumerable<Game> GetAll()
    {
        return _context.Games.ToList<Game>();
    }
}
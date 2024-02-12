using Hootify.DbModel;

namespace Hootify.Infrastructure;

public class SQLPlayerData
{
    private AppDbContext _context;
    public SQLPlayerData(AppDbContext context)
    {
        _context = context;
    }
    public void Add(Player emp)
    {
        _context.Add(emp);
        _context.SaveChanges();
    }
    public Player Get(Guid ID)
    {
        return _context.Players.FirstOrDefault(e => e.Id == ID);
    }
    public IEnumerable<Player> GetAll()
    {
        return _context.Players.ToList<Player>();
    }
}
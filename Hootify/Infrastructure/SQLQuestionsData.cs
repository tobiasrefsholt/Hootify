using Hootify.DbModel;

namespace Hootify.Infrastructure;

public class SQLQuestionsData
{
    private AppDbContext _context { get; set; } 
    public SQLQuestionsData(AppDbContext context) { 
        _context = context;
    }
    public void Add(Question emp) { 
        _context.Add(emp); 
        _context.SaveChanges(); 
    } 
    public Question Get(Guid ID) { 
        return _context.Questions.FirstOrDefault(e => e.Id == ID); 
    } 
    public IEnumerable<Question> GetAll() { 
        return _context.Questions.ToList<Question>(); 
    } 
}
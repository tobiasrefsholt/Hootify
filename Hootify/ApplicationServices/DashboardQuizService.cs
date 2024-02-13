using Hootify.DbModel;

namespace Hootify.ApplicationServices;

public class DashboardQuizService
{
    AppDbContext _dbContext;

    public DashboardQuizService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public void Add(ViewModel.Quiz quiz, Guid userId)
    {
        var dbQuiz = new Quiz
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Title = quiz.Title,
            Description = quiz.Title,
            QuestionIds = quiz.QuestionIds
        };
        _dbContext.Quizzes.Add(dbQuiz);
        _dbContext.SaveChanges();
    }
    
    public ViewModel.Quiz? Get(Guid id)
    {
        var dbQuiz = _dbContext.Quizzes.FirstOrDefault(e => e.Id == id);
        if (dbQuiz == null) return null;
        return new ViewModel.Quiz
        {
            Id = dbQuiz.Id,
            Title = dbQuiz.Title,
            Description = dbQuiz.Description,
            QuestionIds = dbQuiz.QuestionIds
        };
    }
    
    public List<ViewModel.Quiz> GetAll()
    {
        var dbQuizzes =  _dbContext.Quizzes.ToList();
        return dbQuizzes.Select(q => new ViewModel.Quiz
        {
            Id = q.Id,
            Title = q.Title,
            Description = q.Description,
            QuestionIds = q.QuestionIds
        }).ToList();
    }
    
    public void Update(ViewModel.Quiz quiz)
    {
        var dbQuiz = _dbContext.Quizzes.FirstOrDefault(e => e.Id == quiz.Id);
        dbQuiz.Title = quiz.Title;
        dbQuiz.Description = quiz.Description;
        dbQuiz.QuestionIds = quiz.QuestionIds;
        _dbContext.SaveChanges();
    }
    
    public void Delete(Guid id)
    {
        var dbQuiz = _dbContext.Quizzes.FirstOrDefault(q => q.Id == id);
        if (dbQuiz == null) return;
        _dbContext.Quizzes.Remove(dbQuiz);
        _dbContext.SaveChanges();
    }
}
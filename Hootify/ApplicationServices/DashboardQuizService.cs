using Hootify.DbModel;

namespace Hootify.ApplicationServices;

public class DashboardQuizService(AppDbContext dbContext, HttpContext httpContext)
    : DashboardService(dbContext, httpContext)
{
    public void Add(ViewModel.Quiz quiz)
    {
        var dbQuiz = new Quiz
        {
            Id = Guid.NewGuid(),
            UserId = UserId,
            Title = quiz.Title,
            Description = quiz.Description,
            QuestionIds = quiz.QuestionIds
        };
        DbContext.Quizzes.Add(dbQuiz);
        DbContext.SaveChanges();
    }

    public ViewModel.Quiz? Get(Guid id)
    {
        var dbQuiz = DbContext.Quizzes
            .Where(q => q.UserId == UserId)
            .FirstOrDefault(e => e.Id == id);
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
        var dbQuizzes = DbContext.Quizzes
            .Where(q => q.UserId == UserId)
            .ToList();
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
        var dbQuiz = DbContext.Quizzes
            .Where(q => q.UserId == UserId)
            .FirstOrDefault(e => e.Id == quiz.Id);
        dbQuiz.Title = quiz.Title;
        dbQuiz.Description = quiz.Description;
        dbQuiz.QuestionIds = quiz.QuestionIds;
        DbContext.SaveChanges();
    }

    public void Delete(Guid id)
    {
        var dbQuiz = DbContext.Quizzes
            .Where(q => q.UserId == UserId)
            .FirstOrDefault(q => q.Id == id);
        if (dbQuiz == null) return;
        DbContext.Quizzes.Remove(dbQuiz);
        DbContext.SaveChanges();
    }
}
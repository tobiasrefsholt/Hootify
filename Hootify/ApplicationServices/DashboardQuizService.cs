using Hootify.DbModel;

namespace Hootify.ApplicationServices;

public class DashboardQuizService(AppDbContext dbContext, HttpContext httpContext)
    : DashboardService(dbContext, httpContext)
{
    public void Add(ViewModel.Quiz quiz)
    {
        var dbQuiz = new Quiz(Guid.NewGuid(), UserId, quiz.Title, quiz.Description, quiz.QuestionIds);
        DbContext.Quizzes.Add(dbQuiz);
        DbContext.SaveChanges();
    }

    public ViewModel.Quiz? Get(Guid id)
    {
        var dbQuiz = DbContext.Quizzes
            .Where(q => q.UserId == UserId)
            .FirstOrDefault(e => e.Id == id);
        return dbQuiz != null
            ? new ViewModel.Quiz(dbQuiz.Id, dbQuiz.Title, dbQuiz.Description, dbQuiz.QuestionIds)
            : null;
    }

    public List<ViewModel.Quiz> GetAll()
    {
        var dbQuizzes = DbContext.Quizzes
            .Where(q => q.UserId == UserId)
            .ToList();
        return dbQuizzes
            .Select(q => new ViewModel.Quiz(q.Id, q.Title, q.Description, q.QuestionIds))
            .ToList();
    }

    public bool Update(ViewModel.Quiz quiz)
    {
        var dbQuiz = DbContext.Quizzes
            .Where(q => q.UserId == UserId)
            .FirstOrDefault(e => e.Id == quiz.Id);
        dbQuiz.Title = quiz.Title;
        dbQuiz.Description = quiz.Description;
        dbQuiz.QuestionIds = quiz.QuestionIds;
        var changes = DbContext.SaveChanges();
        return changes > 0;
    }

    public bool Delete(Guid id)
    {
        var dbQuiz = DbContext.Quizzes
            .Where(q => q.UserId == UserId)
            .FirstOrDefault(q => q.Id == id);
        if (dbQuiz == null) return false;
        DbContext.Quizzes.Remove(dbQuiz);
        var changes = DbContext.SaveChanges();
        return changes > 0;
    }
}
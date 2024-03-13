using Hootify.DbModel;
using Microsoft.EntityFrameworkCore;

namespace Hootify.ApplicationServices;

public class DashboardQuizService(AppDbContext dbContext, HttpContext httpContext)
    : DashboardService(dbContext, httpContext)
{
    public async Task<bool> Add(ViewModel.Quiz quiz)
    {
        var dbQuiz = new Quiz(Guid.NewGuid(), UserId, quiz.Title, quiz.Description, quiz.QuestionIds);
        DbContext.Quizzes.Add(dbQuiz);
        var changes = await DbContext.SaveChangesAsync();
        return changes > 0;
    }

    public async Task<ViewModel.Quiz?> Get(Guid id)
    {
        var dbQuiz = await DbContext.Quizzes
            .Where(q => q.UserId == UserId)
            .FirstOrDefaultAsync(e => e.Id == id);
        return dbQuiz != null
            ? new ViewModel.Quiz(dbQuiz.Id, dbQuiz.Title, dbQuiz.Description, dbQuiz.QuestionIds)
            : null;
    }

    public async Task<List<ViewModel.Quiz>> GetAll()
    {
        return await DbContext.Quizzes
            .Where(q => q.UserId == UserId)
            .Select(q => new ViewModel.Quiz(q.Id, q.Title, q.Description, q.QuestionIds))
            .ToListAsync();
    }

    public async Task<bool> Update(ViewModel.Quiz quiz)
    {
        var dbQuiz = await DbContext.Quizzes
            .Where(q => q.UserId == UserId)
            .FirstOrDefaultAsync(e => e.Id == quiz.Id);
        if (dbQuiz == null) return false;
        dbQuiz.Title = quiz.Title;
        dbQuiz.Description = quiz.Description;
        dbQuiz.QuestionIds = quiz.QuestionIds;
        var changes = await DbContext.SaveChangesAsync();
        return changes > 0;
    }

    public async Task<bool> Delete(Guid[] ids)
    {
        var dbQuiz = await DbContext.Quizzes
            .Where(q => q.UserId == UserId)
            .Where(q => ids.Contains(q.Id))
            .ToArrayAsync();
        DbContext.Quizzes.RemoveRange(dbQuiz);
        var changes = await DbContext.SaveChangesAsync();
        return changes > 0;
    }
}
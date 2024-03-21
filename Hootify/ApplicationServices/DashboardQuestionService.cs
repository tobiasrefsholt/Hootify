using Hootify.DbModel;
using Hootify.ViewModel;
using Microsoft.EntityFrameworkCore;
using Question = Hootify.DbModel.Question;

namespace Hootify.ApplicationServices;

public class DashboardQuestionService(AppDbContext dbContext, HttpContext httpContext)
    : DashboardService(dbContext, httpContext)
{
    public async Task<bool> Add(IEnumerable<AddQuestion> viewQuestions)
    {
        var timeStamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        var dbQuestions = viewQuestions.Select(viewQuestion =>
            new Question(
                Guid.NewGuid(),
                UserId,
                viewQuestion.Title,
                viewQuestion.Answers,
                viewQuestion.CorrectAnswer,
                viewQuestion.CategoryId,
                timeStamp,
                timeStamp
                )
        );
        DbContext.Questions.AddRange(dbQuestions);
        var changes = await DbContext.SaveChangesAsync();
        return changes > 0;
    }

    private IQueryable<ViewModel.QuestionWithAnswer> QuestionsWithAnswerQuery(Guid? id)
    {
        return
            from q in DbContext.Questions
            join c in DbContext.Categories on q.CategoryId equals c.Id
            where q.UserId == UserId
            where id == null || q.Id == id
            select new ViewModel.QuestionWithAnswer(
                q.Id,
                q.Title,
                q.Answers,
                c.Name,
                q.CategoryId,
                q.UpdatedAt,
                q.CreatedAt,
                q.CorrectAnswer
            );
    }

    public async Task<ViewModel.QuestionWithAnswer?> Get(Guid id) =>
        await QuestionsWithAnswerQuery(id).FirstOrDefaultAsync();

    public async Task<List<ViewModel.QuestionWithAnswer>> GetAll() =>
        await QuestionsWithAnswerQuery(null).ToListAsync();

    public async Task<bool> Update(ViewModel.QuestionWithAnswer question)
    {
        var dbQuestion = await DbContext.Questions
            .Where(q => q.UserId == UserId)
            .FirstOrDefaultAsync(e => e.Id == question.Id);
        if (dbQuestion == null) return false;
        dbQuestion.Title = question.Title;
        dbQuestion.Answers = question.Answers;
        dbQuestion.CorrectAnswer = question.CorrectAnswer;
        dbQuestion.CategoryId = question.CategoryId;
        dbQuestion.UpdatedAt = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        var changes = await DbContext.SaveChangesAsync();
        return changes < 0;
    }

    public async Task<bool> Delete(Guid[] ids)
    {
        var questions = await DbContext.Questions
            .Where(q => q.UserId == UserId)
            .Where(q => ids.Contains(q.Id))
            .ToListAsync();

        DbContext.Questions.RemoveRange(questions);

        var quizzes = await DbContext.Quizzes
            .Where(q => q.UserId == UserId)
            .ToListAsync();

        quizzes.ForEach(q => q.QuestionIds = q.QuestionIds.Except(ids).ToList());
        var changes = await DbContext.SaveChangesAsync();
        return changes > 0;
    }
}
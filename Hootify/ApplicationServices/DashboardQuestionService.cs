using Hootify.DbModel;
using Hootify.ViewModel;
using Question = Hootify.DbModel.Question;

namespace Hootify.ApplicationServices;

public class DashboardQuestionService(AppDbContext dbContext, HttpContext httpContext)
    : DashboardService(dbContext, httpContext)
{
    public async Task<bool> Add(IEnumerable<AddQuestion> viewQuestions)
    {
        var dbQuestions = viewQuestions.Select(viewQuestion =>
            new Question(
                Guid.NewGuid(),
                UserId,
                viewQuestion.Title,
                viewQuestion.Answers,
                viewQuestion.CorrectAnswer,
                viewQuestion.CategoryId)
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
                q.CorrectAnswer
            );
    }

    public ViewModel.QuestionWithAnswer? Get(Guid id) =>
        QuestionsWithAnswerQuery(id).FirstOrDefault();

    public List<ViewModel.QuestionWithAnswer> GetAll() =>
        QuestionsWithAnswerQuery(null).ToList();

    public void Update(ViewModel.QuestionWithAnswer question)
    {
        var dbQuestion = DbContext.Questions
            .Where(q => q.UserId == UserId)
            .FirstOrDefault(e => e.Id == question.Id);
        if (dbQuestion == null) return;
        dbQuestion.Title = question.Title;
        dbQuestion.Answers = question.Answers;
        dbQuestion.CorrectAnswer = question.CorrectAnswer;
        dbQuestion.CategoryId = question.CategoryId;
        DbContext.SaveChanges();
    }

    public void Delete(Guid id)
    {
        var question = DbContext.Questions
            .Where(q => q.UserId == UserId)
            .FirstOrDefault(e => e.Id == id);
        if (question == null) return;
        DbContext.Questions.Remove(question);
        DbContext.Quizzes
            .Where(q => q.UserId == UserId)
            .ToList()
            .ForEach(q => q.QuestionIds.Remove(id));
        DbContext.SaveChanges();
    }
}
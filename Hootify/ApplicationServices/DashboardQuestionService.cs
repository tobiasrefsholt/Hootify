using Hootify.DbModel;

namespace Hootify.ApplicationServices;

public class DashboardQuestionService(AppDbContext dbContext, HttpContext httpContext)
    : DashboardService(dbContext, httpContext)
{
    public void Add(ViewModel.AddQuestion viewQuestion)
    {
        var dbQuestion = new Question
        {
            Id = Guid.NewGuid(),
            UserId = UserId,
            Title = viewQuestion.Title,
            Answers = viewQuestion.Answers,
            CorrectAnswer = viewQuestion.CorrectAnswer,
            CategoryId = viewQuestion.CategoryId
        };

        DbContext.Add(dbQuestion);
        DbContext.SaveChanges();
    }

    public ViewModel.QuestionWithAnswer? Get(Guid id)
    {
        return (
            from q in DbContext.Questions
            where q.UserId == UserId
            join c in DbContext.Categories on q.CategoryId equals c.Id
            select new ViewModel.QuestionWithAnswer
            {
                Id = q.Id,
                Title = q.Title,
                Answers = q.Answers,
                CorrectAnswer = q.CorrectAnswer,
                Category = c.Name,
                CategoryId = q.CategoryId
            }).FirstOrDefault(q => q.Id == id);
    }

    public List<ViewModel.QuestionWithAnswer> GetAll()
    {
        var questions = (
            from q in DbContext.Questions
            where q.UserId == UserId
            join c in DbContext.Categories on q.CategoryId equals c.Id
            select new ViewModel.QuestionWithAnswer
            {
                Id = q.Id,
                Title = q.Title,
                Answers = q.Answers,
                CorrectAnswer = q.CorrectAnswer,
                Category = c.Name,
                CategoryId = q.CategoryId
            }).ToList();
        return questions;
    }

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
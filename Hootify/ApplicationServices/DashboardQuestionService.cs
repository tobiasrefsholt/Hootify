using Hootify.DbModel;

namespace Hootify.ApplicationServices;

public class DashboardQuestionService
{
    private readonly AppDbContext _dbContext;

    public DashboardQuestionService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public void Add(ViewModel.AddQuestion viewQuestion, Guid userId)
    {
        var dbQuestion = new Question
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Title = viewQuestion.Title,
            Answers = viewQuestion.Answers,
            CorrectAnswer = viewQuestion.CorrectAnswer,
            CategoryId = viewQuestion.CategoryId
        };

        _dbContext.Add(dbQuestion);
        _dbContext.SaveChanges();
    }

    public ViewModel.QuestionWithAnswer? Get(Guid id)
    {
        return (
            from q in _dbContext.Questions
            join c in _dbContext.Categories on q.CategoryId equals c.Id
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
            from q in _dbContext.Questions
            join c in _dbContext.Categories on q.CategoryId equals c.Id
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
        var dbQuestion = _dbContext.Questions.FirstOrDefault(e => e.Id == question.Id);
        if (dbQuestion == null) return;
        dbQuestion.Title = question.Title;
        dbQuestion.Answers = question.Answers;
        dbQuestion.CorrectAnswer = question.CorrectAnswer;
        dbQuestion.CategoryId = question.CategoryId;
        _dbContext.SaveChanges();
    }

    public void Delete(Guid id)
    {
        var question = _dbContext.Questions.FirstOrDefault(e => e.Id == id);
        if (question == null) return;
        _dbContext.Questions.Remove(question);
        _dbContext.SaveChanges();
    }
}
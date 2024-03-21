namespace Hootify.ViewModel;

public class QuestionWithAnswer : Question
{
    public int CorrectAnswer { get; set; }

    public QuestionWithAnswer(Guid id, string title, string[] answers, string category, Guid categoryId, long startTime,
        int seconds, long updatedAt, long createdAt, int correctAnswer) : base(id, title, answers, category, categoryId, startTime,
        seconds, updatedAt, createdAt)
    {
        CorrectAnswer = correctAnswer;
    }

    public QuestionWithAnswer(Guid id, string title, string[] answers, string category, Guid categoryId, long updatedAt,
        long createdAt, int correctAnswer) : base(id, title, answers, category, categoryId, updatedAt, createdAt)
    {
        CorrectAnswer = correctAnswer;
    }
    
    public QuestionWithAnswer()
    {
    }
}
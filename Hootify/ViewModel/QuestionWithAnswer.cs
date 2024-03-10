namespace Hootify.ViewModel;

public class QuestionWithAnswer : Question
{
    public int CorrectAnswer { get; set; }

    public QuestionWithAnswer(Guid id, string title, string[] answers, string category, Guid categoryId,
        DateTime startTime, int seconds, int correctAnswer) : base(id, title, answers, category, categoryId, startTime,
        seconds)
    {
        CorrectAnswer = correctAnswer;
    }

    public QuestionWithAnswer(Guid id, string title, string[] answers, string category, Guid categoryId,
        int correctAnswer) : base(id, title, answers, category, categoryId)
    {
        CorrectAnswer = correctAnswer;
    }

    public QuestionWithAnswer()
    {
    }
}
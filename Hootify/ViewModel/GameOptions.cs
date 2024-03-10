namespace Hootify.ViewModel;

public class GameOptions
{
    public Guid QuizId { get; set; }
    public string Title { get; set; }
    public bool RandomizeQuestions { get; set; }
    public bool RandomizeAnswers { get; set; }
    public int SecondsPerQuestion { get; set; }

    public GameOptions(Guid quizId, string title, bool randomizeQuestions, bool randomizeAnswers,
        int secondsPerQuestion)
    {
        QuizId = quizId;
        Title = title;
        RandomizeQuestions = randomizeQuestions;
        RandomizeAnswers = randomizeAnswers;
        SecondsPerQuestion = secondsPerQuestion;
    }

    public GameOptions()
    {
    }
}
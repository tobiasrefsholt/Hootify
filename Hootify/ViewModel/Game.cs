namespace Hootify.ViewModel;

public class Game
{
    public Guid Id { get; set; }
    public string ShareKey { get; set; }
    public Guid QuizId { get; set; }
    public string Title { get; set; }
    public bool RandomizeQuestions { get; set; }
    public bool RandomizeAnswers { get; set; }
    public int SecondsPerQuestion { get; set; }
    public GameState State { get; set; }
    public Guid CurrentQuestionId { get; set; }
    public int CurrentQuestionNumber { get; set; }
    public long CurrentQuestionStartTime { get; set; }
    public List<Guid>? RemainingQuestions { get; set; }
    public long CreatedAt { get; set; }

    public Game(Guid id, string shareKey, Guid quizId, string title, bool randomizeQuestions, bool randomizeAnswers,
        int secondsPerQuestion, GameState state, Guid currentQuestionId, int currentQuestionNumber,
        long currentQuestionStartTime, List<Guid>? remainingQuestions, long createdAt)
    {
        Id = id;
        ShareKey = shareKey;
        QuizId = quizId;
        Title = title;
        RandomizeQuestions = randomizeQuestions;
        RandomizeAnswers = randomizeAnswers;
        SecondsPerQuestion = secondsPerQuestion;
        State = state;
        CurrentQuestionId = currentQuestionId;
        CurrentQuestionNumber = currentQuestionNumber;
        CurrentQuestionStartTime = currentQuestionStartTime;
        RemainingQuestions = remainingQuestions;
        CreatedAt = createdAt;
    }

    public Game()
    {
    }
}
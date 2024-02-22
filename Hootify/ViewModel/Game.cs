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
    public DateTime CurrentQuestionStartTime { get; set; }
    public List<Guid>? RemainingQuestions { get; set; }
}
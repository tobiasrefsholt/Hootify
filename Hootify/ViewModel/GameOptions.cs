namespace Hootify.ViewModel;

public class GameOptions
{
    public Guid QuizId { get; set; }
    public string Title { get; set; }
    public bool RandomizeQuestions { get; set; }
    public bool RandomizeAnswers { get; set; }
    public int SecondsPerQuestion { get; set; }
}
using System.ComponentModel.DataAnnotations;

namespace Hootify.DbModel;

public class Game
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    [MaxLength(6)]
    public string ShareKey { get; set; }
    public Guid QuizId { get; set; }
    [MaxLength(100)]
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

    public Game(Guid id, Guid userId, string shareKey, Guid quizId, string title, bool randomizeQuestions,
        bool randomizeAnswers, int secondsPerQuestion, GameState state, List<Guid>? remainingQuestions, long createdAt)
    {
        Id = id;
        UserId = userId;
        ShareKey = shareKey;
        QuizId = quizId;
        Title = title;
        RandomizeQuestions = randomizeQuestions;
        RandomizeAnswers = randomizeAnswers;
        SecondsPerQuestion = secondsPerQuestion;
        State = state;
        RemainingQuestions = remainingQuestions;
        CreatedAt = createdAt;
    }

    public Game()
    {
    }
}
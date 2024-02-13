using Hootify.DbModel;

namespace Hootify.ApplicationServices;

public class DashboardGameService
{
    private readonly AppDbContext _dbContext;
    private readonly Random _random = new Random();

    public DashboardGameService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    
    public Guid New(ViewModel.GameOptions gameOptions)
    {
        var activeQuiz = _dbContext.Quizzes.FirstOrDefault(q => q.Id == gameOptions.QuizId);
        if (activeQuiz == null) throw new Exception("Quiz not found");
        var gameId = Guid.NewGuid();
        var dbGame = new Game
        {
            Id = gameId,
            QuizId = gameOptions.QuizId,
            Title = gameOptions.Title,
            RandomizeQuestions = gameOptions.RandomizeQuestions,
            RandomizeAnswers = gameOptions.RandomizeAnswers,
            SecondsPerQuestion = gameOptions.SecondsPerQuestion,
            State = GameState.WaitingForPlayers,
            RemainingQuestions = activeQuiz.QuestionIds
        };
        _dbContext.Games.Add(dbGame);
        _dbContext.SaveChanges();
        return gameId;
    }
}
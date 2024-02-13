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
        var shareKey = GenerateShareKey();
        var dbGame = new Game
        {
            Id = gameId,
            ShareKey = shareKey,
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

    private string GenerateShareKey()
    {
        while (true)
        {
            var key = _random.Next(100000, 999999).ToString();
            if (_dbContext.Games.Any(g => g.ShareKey == key))
                continue;
            return key;
        }
    }
}
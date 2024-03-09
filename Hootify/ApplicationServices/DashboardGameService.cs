using Hootify.DbModel;

namespace Hootify.ApplicationServices;

public class DashboardGameService(AppDbContext dbContext, HttpContext httpContext)
    : DashboardService(dbContext, httpContext)
{
    private readonly Random _random = new();

    public ViewModel.Game New(ViewModel.GameOptions gameOptions)
    {
        var activeQuiz = DbContext.Quizzes.FirstOrDefault(q => q.Id == gameOptions.QuizId);
        if (activeQuiz == null) throw new Exception("Quiz not found");
        var gameId = Guid.NewGuid();
        var shareKey = GenerateShareKey();
        var dbGame = new Game
        {
            Id = gameId,
            UserId = UserId,
            ShareKey = shareKey,
            QuizId = gameOptions.QuizId,
            Title = gameOptions.Title,
            RandomizeQuestions = gameOptions.RandomizeQuestions,
            RandomizeAnswers = gameOptions.RandomizeAnswers,
            SecondsPerQuestion = gameOptions.SecondsPerQuestion,
            State = GameState.WaitingForPlayers,
            RemainingQuestions = activeQuiz.QuestionIds
        };
        DbContext.Games.Add(dbGame);
        DbContext.SaveChanges();
        var viewGame = Get(gameId);
        return viewGame ?? throw new Exception("Game not found");
    }

    public ViewModel.Game? Get(Guid gameId)
    {
        return DbContext.Games
            .Where(g => g.UserId == UserId && g.Id == gameId)
            .Select(g => new ViewModel.Game
            {
                Id = g.Id,
                ShareKey = g.ShareKey,
                QuizId = g.QuizId,
                Title = g.Title,
                RandomizeQuestions = g.RandomizeQuestions,
                RandomizeAnswers = g.RandomizeAnswers,
                SecondsPerQuestion = g.SecondsPerQuestion,
                State = g.State,
                CurrentQuestionId = g.CurrentQuestionId,
                CurrentQuestionNumber = g.CurrentQuestionNumber,
                CurrentQuestionStartTime = g.CurrentQuestionStartTime,
                RemainingQuestions = g.RemainingQuestions
            })
            .FirstOrDefault();
    }

    public List<ViewModel.Game> GetAll(GameState? gameState)
    {
        if (gameState == null)
            return DbContext.Games
                .Where(g => g.UserId == UserId)
                .Select(g => GetViewModel(g))
                .ToList();

        return DbContext.Games
            .Where(g => g.State == gameState)
            .Select(g => GetViewModel(g))
            .ToList();
    }

    private string GenerateShareKey()
    {
        while (true)
        {
            var key = _random.Next(100000, 999999).ToString();
            if (DbContext.Games.Any(g => g.ShareKey == key))
                continue;
            return key;
        }
    }

    private static ViewModel.Game GetViewModel(Game game)
    {
        return new ViewModel.Game
        {
            Id = game.Id,
            ShareKey = game.ShareKey,
            QuizId = game.QuizId,
            Title = game.Title,
            RandomizeQuestions = game.RandomizeQuestions,
            RandomizeAnswers = game.RandomizeAnswers,
            SecondsPerQuestion = game.SecondsPerQuestion,
            State = game.State,
            CurrentQuestionId = game.CurrentQuestionId,
            CurrentQuestionNumber = game.CurrentQuestionNumber,
            CurrentQuestionStartTime = game.CurrentQuestionStartTime,
            RemainingQuestions = game.RemainingQuestions,
        };
    }
}
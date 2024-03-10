using Hootify.DbModel;

namespace Hootify.ApplicationServices;

public class DashboardGameService(AppDbContext dbContext, HttpContext httpContext)
    : DashboardService(dbContext, httpContext)
{
    private readonly Random _random = new();

    public bool New(ViewModel.GameOptions gameOptions)
    {
        var activeQuiz = DbContext.Quizzes.FirstOrDefault(q => q.Id == gameOptions.QuizId);
        if (activeQuiz == null) throw new Exception("Quiz not found");
        var gameId = Guid.NewGuid();
        var shareKey = GenerateShareKey();
        var dbGame = new Game(
            gameId,
            UserId,
            shareKey,
            gameOptions.QuizId,
            gameOptions.Title,
            gameOptions.RandomizeQuestions,
            gameOptions.RandomizeAnswers,
            gameOptions.SecondsPerQuestion,
            GameState.WaitingForPlayers,
            activeQuiz.QuestionIds
        );
        DbContext.Games.Add(dbGame);
        var changes = DbContext.SaveChanges();
        return changes > 0;
    }

    public ViewModel.Game? Get(Guid gameId)
    {
        return DbContext.Games
            .Where(g => g.UserId == UserId && g.Id == gameId)
            .Select(g => GetViewModel(g))
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
            .Where(g => g.UserId == UserId)
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
        return new ViewModel.Game(
            game.Id,
            game.ShareKey,
            game.QuizId,
            game.Title,
            game.RandomizeQuestions,
            game.RandomizeAnswers,
            game.SecondsPerQuestion,
            game.State,
            game.CurrentQuestionId,
            game.CurrentQuestionNumber,
            game.CurrentQuestionStartTime,
            game.RemainingQuestions
        );
    }
}
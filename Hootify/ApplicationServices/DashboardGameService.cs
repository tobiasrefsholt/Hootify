using Hootify.DbModel;
using Microsoft.EntityFrameworkCore;

namespace Hootify.ApplicationServices;

public class DashboardGameService(AppDbContext dbContext, HttpContext httpContext)
    : DashboardService(dbContext, httpContext)
{
    private readonly Random _random = new();

    public async Task<bool> New(ViewModel.GameOptions gameOptions)
    {
        var activeQuiz = await DbContext.Quizzes.FirstOrDefaultAsync(q => q.Id == gameOptions.QuizId);
        if (activeQuiz == null) throw new Exception("Quiz not found");
        var gameId = Guid.NewGuid();
        var shareKey = GenerateShareKey();
        var timeStamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
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
            activeQuiz.QuestionIds,
            timeStamp
        );
        DbContext.Games.Add(dbGame);
        var changes = await DbContext.SaveChangesAsync();
        return changes > 0;
    }

    public async Task<ViewModel.Game?> Get(Guid gameId)
    {
        return await DbContext.Games
            .Where(g => g.UserId == UserId && g.Id == gameId)
            .Select(g => GetViewModel(g))
            .FirstOrDefaultAsync();
    }

    public async Task<List<ViewModel.Game>> GetAll(GameState? gameState)
    {
        if (gameState == null)
            return await DbContext.Games
                .Where(g => g.UserId == UserId)
                .Select(g => GetViewModel(g))
                .ToListAsync();

        return await DbContext.Games
            .Where(g => g.UserId == UserId)
            .Where(g => g.State == gameState)
            .Select(g => GetViewModel(g))
            .ToListAsync();
    }

    public async Task<object> Delete(Guid[] gameIds)
    {
        var games = await DbContext.Games
            .Where(g => g.UserId == UserId)
            .Where(g => gameIds.Contains(g.Id))
            .ToArrayAsync();
        
        var players = await DbContext.Players
            .Where(p => gameIds.Contains(p.GameId))
            .ToArrayAsync();
        
        var answers = await DbContext.GameAnswers
            .Where(a => gameIds.Contains(a.GameId))
            .ToArrayAsync();
        
        DbContext.Games.RemoveRange(games);
        DbContext.Players.RemoveRange(players);
        DbContext.GameAnswers.RemoveRange(answers);
        var changes = await DbContext.SaveChangesAsync();
        return changes > 0;
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
            game.RemainingQuestions,
            game.CreatedAt
        );
    }
}
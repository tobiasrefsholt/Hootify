using Hootify.DbModel;
using Player = Hootify.ViewModel.Player;

namespace Hootify.ApplicationServices;

public class PlayerService
{
    private readonly AppDbContext _dbContext;

    public PlayerService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public ViewModel.Game? GetGameByPin(string shareKey)
    {
        var dbGame = _dbContext.Games.FirstOrDefault(g => g.ShareKey == shareKey);
        if (dbGame == null) return null;
        return new ViewModel.Game
        {
            Id = dbGame.Id,
            Title = dbGame.Title
        };
    }

    public Player? AddPlayerToGame(Guid gameId, Player player)
    {
        var gameExists = _dbContext.Games.Any(g => g.Id == gameId);
        if (!gameExists) return null;

        var dbPlayer = new DbModel.Player
        {
            Id = Guid.NewGuid(),
            GameId = gameId,
            Name = player.Name,
            Score = 0
        };

        _dbContext.Players.Add(dbPlayer);
        _dbContext.SaveChanges();

        return new Player
        {
            Id = dbPlayer.Id,
            Name = dbPlayer.Name,
            Score = dbPlayer.Score
        };
    }

    public bool AnswerQuestion(Guid playerId, Guid gameId, Guid questionId, int answer)
    {
        if (!CanAnswerQuestion(playerId, gameId, questionId)) return false;

        var dbAnswer = new GameAnswer
        {
            Id = Guid.NewGuid(),
            GameId = gameId,
            PlayerId = playerId,
            QuestionId = questionId,
            Answer = answer
        };

        _dbContext.GameAnswers.Add(dbAnswer);
        var save = _dbContext.SaveChanges();
        return save > 0;
    }

    private bool CanAnswerQuestion(Guid playerId, Guid gameId, Guid questionId)
    {
        var game = _dbContext.Games.FirstOrDefault(g => g.Id == gameId);
        if (game == null ||
            // Question is not the current question
            game.CurrentQuestionId != questionId ||
            // Question has expired
            /*game.CurrentQuestionStartTime.AddSeconds(game.SecondsPerQuestion) < DateTime.Now ||
            // Question has not started
            game.CurrentQuestionStartTime > DateTime.Now ||*/
            // Game is not in progress
            game.State != GameState.QuestionInProgress)
            return false;

        // Player has already answered this question
        var answerExists = _dbContext.GameAnswers.Any(a => a.QuestionId == questionId && a.PlayerId == playerId);
        if (answerExists) return false;

        // Player and question exist
        return _dbContext.Players.Any(p => p.Id == playerId) &&
               _dbContext.Questions.Any(q => q.Id == questionId);
    }
}
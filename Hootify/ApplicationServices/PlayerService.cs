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
            game.CurrentQuestionStartTime.AddSeconds(game.SecondsPerQuestion) < DateTime.Now ||
            // Question has not started
            game.CurrentQuestionStartTime > DateTime.Now ||
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

    public bool AllPlayersAnswered(Guid gameId, Guid questionId)
    {
        var players = _dbContext.Players
            .Where(p => p.GameId == gameId)
            .Select(p => p.Id)
            .ToArray();

        var answers = _dbContext.GameAnswers
            .Where(a => a.GameId == gameId && a.QuestionId == questionId)
            .Select(a => a.PlayerId)
            .ToArray();

        return players.All(p => answers.Contains(p));
    }

    public Player[] GetLeaderBoard(Guid gameId)
    {
        return _dbContext.Players
            .Where(p => p.GameId == gameId)
            .OrderByDescending(p => p.Score)
            .Select(p => new Player
            {
                Id = p.Id,
                Name = p.Name,
                Score = p.Score
            })
            .ToArray();
    }

    public ViewModel.Question? GetCurrentQuestion(Guid gameId)
    {
        var currentQuestionId = CurrentQuestionId(gameId);

        return (
            from q in _dbContext.Questions
            join c in _dbContext.Categories on q.CategoryId equals c.Id
            join g in _dbContext.Games on q.Id equals g.CurrentQuestionId
            where (q.Id == currentQuestionId)
            select new ViewModel.Question
            {
                Id = q.Id,
                Title = q.Title,
                Answers = q.Answers,
                Category = c.Name,
                CategoryId = c.Id,
                StartTime = g.CurrentQuestionStartTime,
                Seconds = g.SecondsPerQuestion
            }
        ).FirstOrDefault();
    }

    public ViewModel.QuestionWithAnswer? GetCurrentQuestionWithAnswer(Guid gameId)
    {
        var currentQuestionId = CurrentQuestionId(gameId);

        return _dbContext.Questions
            .Where(q => q.Id == currentQuestionId)
            .Select(q => new ViewModel.QuestionWithAnswer
            {
                Id = q.Id,
                Title = q.Title,
                Answers = q.Answers,
                CorrectAnswer = q.CorrectAnswer
            })
            .FirstOrDefault();
    }

    private Guid CurrentQuestionId(Guid gameId)
    {
        var currentQuestionId = _dbContext.Games
            .Where(g => g.Id == gameId)
            .Select(g => g.CurrentQuestionId)
            .FirstOrDefault();
        return currentQuestionId;
    }
}
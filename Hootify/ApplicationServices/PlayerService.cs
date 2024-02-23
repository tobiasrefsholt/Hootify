using Hootify.DbModel;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Player = Hootify.ViewModel.Player;

namespace Hootify.ApplicationServices;

public class PlayerService
{
    private readonly AppDbContext _dbContext;
    private readonly IHubContext<GameHub, IGameHub> _gameHubContext;

    public PlayerService(AppDbContext dbContext, IHubContext<GameHub, IGameHub> gameHubContext)
    {
        _dbContext = dbContext;
        _gameHubContext = gameHubContext;
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

    public async Task AnswerQuestion(Guid playerId, Guid gameId, Guid questionId, int answer)
    {
        if (!CanAnswerQuestion(playerId, gameId, questionId))
        {
            await _gameHubContext.Clients.Group(playerId.ToString()).ReceiveMessage("Failed to answer question");
            return;
        }

        await CheckAnswer(playerId, questionId, answer);

        var dbAnswer = new GameAnswer
        {
            Id = Guid.NewGuid(),
            GameId = gameId,
            PlayerId = playerId,
            QuestionId = questionId,
            Answer = answer
        };
        _dbContext.GameAnswers.Add(dbAnswer);
        await _dbContext.SaveChangesAsync();

        await CheckIfAllPlayersAnswered(gameId, questionId);
    }

    private async Task CheckAnswer(Guid playerId, Guid questionId, int answer)
    {
        var answerIsCorrect = _dbContext.Questions
            .Where(q => q.Id == questionId)
            .Select(q => q.CorrectAnswer)
            .FirstOrDefault() == answer;

        if (!answerIsCorrect)
        {
            await _gameHubContext.Clients.Group(playerId.ToString()).ReceiveMessage("Incorrect answer");
            return;
        }

        // Update player score if answer is correct
        await _dbContext.Players
            .Where(p => p.Id == playerId)
            .ExecuteUpdateAsync(
                s => s.SetProperty(
                    p => p.Score, p => p.Score + 1
                )
            );

        await _gameHubContext.Clients.Group(playerId.ToString()).ReceiveMessage("Correct answer");
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

    private async Task CheckIfAllPlayersAnswered(Guid gameId, Guid questionId)
    {
        var players = _dbContext.Players
            .Where(p => p.GameId == gameId)
            .Select(p => p.Id)
            .ToArray();

        var answers = _dbContext.GameAnswers
            .Where(a => a.GameId == gameId && a.QuestionId == questionId)
            .Select(a => a.PlayerId)
            .ToArray();

        if (!players.All(p => answers.Contains(p))) return;

        await HandleFinishedQuestion(gameId);
    }

    private async Task HandleFinishedQuestion(Guid gameId)
    {
        await _dbContext.Games
            .Where(g => g.Id == gameId)
            .ExecuteUpdateAsync(b =>
                b.SetProperty(g => g.State, GameState.QuestionComplete)
            );
        var leaderBoard = GetLeaderBoard(gameId);
        await _gameHubContext.Clients
            .Group(gameId.ToString())
            .ReceiveLeaderBoard(GameState.GameComplete, leaderBoard);
    }

    private Player[] GetLeaderBoard(Guid gameId)
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

    private ViewModel.Question? GetCurrentQuestion(Guid gameId)
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

    private ViewModel.QuestionWithAnswer? GetCurrentQuestionWithAnswer(Guid gameId)
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

    public async Task GetGameState(Guid playerId)
    {
        var gameId = GetGameIdByPlayer(playerId);
        var gameState = GetState(gameId);

        switch (gameState)
        {
            case GameState.QuestionInProgress:
                var currentQuestion = GetCurrentQuestion(gameId);
                await _gameHubContext.Clients
                    .Group(playerId.ToString())
                    .ReceiveNewQuestion(GameState.QuestionInProgress, currentQuestion!);
                break;

            case GameState.QuestionComplete:
                var questionWithAnswer = GetCurrentQuestionWithAnswer(gameId);
                await _gameHubContext.Clients
                    .Group(gameId.ToString())
                    .ReceiveAnswer(GameState.QuestionComplete, questionWithAnswer);
                break;

            case GameState.GameComplete:
                var leaderBoard = GetLeaderBoard(gameId);
                await _gameHubContext.Clients
                    .Group(playerId.ToString())
                    .ReceiveLeaderBoard(GameState.GameComplete, leaderBoard);
                break;

            case GameState.WaitingForPlayers:
            default:
                var players = GetPlayers(gameId);
                await _gameHubContext.Clients
                    .Group(gameId.ToString())
                    .ReceiveWaitingPlayers(gameState, players);
                break;
        }
    }

    private GameState GetState(Guid gameId)
    {
        return _dbContext.Games
            .Where(g => g.Id == gameId)
            .Select(g => g.State)
            .FirstOrDefault();
    }

    private Player[] GetPlayers(Guid gameId)
    {
        return _dbContext.Players
            .Where(p => p.GameId == gameId)
            .Select(p => new ViewModel.Player
            {
                Id = p.Id,
                Name = p.Name,
                Score = p.Score
            })
            .ToArray();
    }

    public Player? GetPlayer(Guid playerId)
    {
        return _dbContext.Players
            .Where(p => p.Id == playerId)
            .Select(p => new Player
            {
                Id = p.Id,
                Name = p.Name,
                Score = p.Score
            })
            .FirstOrDefault();
    }

    public Guid GetGameIdByPlayer(Guid playerId)
    {
        return _dbContext.Players
            .Where(p => p.Id == playerId)
            .Select(p => p.GameId)
            .FirstOrDefault();
    }

    public async Task SendWelcomeMessage(Guid playerId)
    {
        var player = GetPlayer(playerId);
        await _gameHubContext.Clients.All.ReceiveMessage($"{player!.Name} has joined the game!");
    }
}
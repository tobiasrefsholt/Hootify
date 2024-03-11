using System.Diagnostics.CodeAnalysis;
using Hootify.DbModel;
using Hootify.Hubs;
using Hootify.Hubs.ClientInterfaces;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace Hootify.ApplicationServices;

public class GameService
{
    private readonly AppDbContext _dbContext;
    private readonly IHubContext<PlayerHub, IPlayerHub> _playerHubContext;
    private readonly IHubContext<DashboardHub, IDashboardHub> _dashboardHubContext;
    private readonly Random _random = new();

    public GameService(AppDbContext dbContext, IHubContext<PlayerHub, IPlayerHub> playerHubContext,
        IHubContext<DashboardHub, IDashboardHub> dashboardHubContext)
    {
        _dbContext = dbContext;
        _playerHubContext = playerHubContext;
        _dashboardHubContext = dashboardHubContext;
    }

    public Guid? GetGameByPin(string shareKey)
    {
        var dbGame = _dbContext.Games.FirstOrDefault(g => g.ShareKey == shareKey);
        return dbGame?.Id;
    }

    public ViewModel.Player? AddPlayerToGame(Guid gameId, ViewModel.Player player)
    {
        var gameExists = _dbContext.Games.Any(g => g.Id == gameId);
        if (!gameExists) return null;

        var dbPlayer = new Player
        {
            Id = Guid.NewGuid(),
            GameId = gameId,
            Name = player.Name,
            Score = 0
        };

        _dbContext.Players.Add(dbPlayer);
        _dbContext.SaveChanges();

        return new ViewModel.Player(dbPlayer.Id, dbPlayer.Name, dbPlayer.Score);
    }

    public async Task GetGameState(Guid playerId)
    {
        var gameId = GetGameIdByPlayer(playerId);
        var gameState = GetState(gameId);
        var recipientGroup = playerId.ToString();

        switch (gameState)
        {
            case GameState.QuestionInProgress:
                await SendQuestion(gameId, recipientGroup);
                break;

            case GameState.ShowAnswer:
                await SendAnswer(gameId, recipientGroup);
                break;

            case GameState.ShowLeaderboard:
                await SendLeaderBoard(gameId, recipientGroup);
                break;

            case GameState.GameComplete:
                await SendGameComplete(gameId, recipientGroup);
                break;

            case GameState.WaitingForPlayers:
            default:
                await SendLeaderBoard(gameId, recipientGroup);
                await _dashboardHubContext.Clients.Group("dashboard_" + gameId)
                    .ReceiveLeaderBoard(GetLeaderBoard(gameId));
                await SendWaitingPlayers(gameId, recipientGroup);
                break;
        }
    }

    public async Task UpdateDashboardState(Guid gameId)
    {
        var recipientGroup = "dashboard_" + gameId;
        var client = _dashboardHubContext.Clients.Group(recipientGroup);
        await client.ReceiveGameState(GetState(gameId));
        await client.ReceiveAnswer(GetCurrentQuestionWithAnswer(gameId));
        await client.ReceiveLeaderBoard(GetLeaderBoard(gameId));
        await client.ReceiveGameOptions(GetGameOptions(gameId));
    }

    public async Task SendWaitingPlayers(Guid gameId, string recipientGroup)
    {
        var players = GetPlayers(gameId);
        var clients = _playerHubContext.Clients.Group(recipientGroup);
        await clients.ReceiveGameState(GameState.WaitingForPlayers);
        await clients.ReceiveLeaderBoard(players);
    }

    public async Task SendQuestion(Guid gameId, string recipientGroup)
    {
        var currentQuestion = GetCurrentQuestion(gameId);
        // Check if question has expired and handle it
        if (currentQuestion?.StartTime.AddSeconds(currentQuestion.Seconds) < DateTime.Now)
        {
            // Question has expired
            await HandleFinishedQuestion(gameId);
            await UpdateDashboardState(gameId);
            return;
        }

        var clients = _playerHubContext.Clients.Group(recipientGroup);
        await clients.ReceiveNewQuestion(currentQuestion);
        await clients.ReceiveGameState(GameState.QuestionInProgress);
    }

    public async Task SendAnswer(Guid gameId, string recipientGroup)
    {
        var questionWithAnswer = GetCurrentQuestionWithAnswer(gameId);
        var clients = _playerHubContext.Clients.Group(recipientGroup);
        await clients.ReceiveAnswer(questionWithAnswer);
        await clients.ReceiveGameState(GameState.ShowAnswer);
    }

    public async Task SendLeaderBoard(Guid gameId, string recipientGroup)
    {
        var leaderBoard = GetLeaderBoard(gameId);
        var clients = _playerHubContext.Clients.Group(recipientGroup);
        await clients.ReceiveLeaderBoard(leaderBoard);
        await clients.ReceiveGameState(GameState.ShowLeaderboard);
    }

    public async Task SendGameComplete(Guid gameId, string recipientGroup)
    {
        var leaderBoard = GetLeaderBoard(gameId);
        var clients = _playerHubContext.Clients.Group(recipientGroup);
        await clients.ReceiveLeaderBoard(leaderBoard);
        await clients.ReceiveGameState(GameState.GameComplete);
    }

    public async Task SendWelcomeMessage(Guid playerId, Guid gameId, string connectionId)
    {
        var player = GetPlayer(playerId);
        await _playerHubContext.Clients
            .GroupExcept(gameId.ToString(), connectionId)
            .ReceiveMessage($"{player!.Name} has joined the game!");
    }

    public async Task SendDisconnectMessage(Guid playerId)
    {
        var player = GetPlayer(playerId);
        var gameId = GetGameIdByPlayer(playerId);
        var message = $"{player!.Name} has left the game!";

        await _playerHubContext.Clients
            .Group(gameId.ToString())
            .ReceiveMessage(message);
        await _dashboardHubContext.Clients
            .Group("dashboard_" + gameId)
            .ReceiveMessage(message);
    }

    public async Task AnswerQuestion(Guid playerId, Guid gameId, Guid questionId, int answer)
    {
        if (!CanAnswerQuestion(playerId, gameId, questionId))
        {
            await _playerHubContext.Clients.Group(playerId.ToString()).ReceiveMessage("Failed to answer question");
            return;
        }

        // Check if answer is correct, update player score and send message
        await CheckAnswer(playerId, questionId, answer);

        // Send updated leaderboard to dashboard
        var dashboardHub = _dashboardHubContext.Clients.Group("dashboard_" + gameId);
        await dashboardHub.ReceiveLeaderBoard(GetLeaderBoard(gameId));

        // Save answer to database
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
            await _playerHubContext.Clients.Group(playerId.ToString()).ReceiveMessage("Incorrect answer");
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

        await _playerHubContext.Clients.Group(playerId.ToString()).ReceiveMessage("Correct answer");
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

    public async Task HandleFinishedQuestion(Guid gameId)
    {
        // Update game state to show answer
        await _dbContext.Games
            .Where(g => g.Id == gameId)
            .ExecuteUpdateAsync(b =>
                b.SetProperty(g => g.State, GameState.ShowAnswer)
            );

        // Send answer to players
        var currentQuestionWithAnswer = GetCurrentQuestionWithAnswer(gameId);
        var clients = _playerHubContext.Clients.Group(gameId.ToString());
        await clients.ReceiveAnswer(currentQuestionWithAnswer);
        await clients.ReceiveGameState(GameState.ShowAnswer);

        // Update dashboard state
        await UpdateDashboardState(gameId);
    }

    private ViewModel.Question? GetCurrentQuestion(Guid gameId)
    {
        var currentQuestionId = CurrentQuestionId(gameId);

        return (
            from q in _dbContext.Questions
            join c in _dbContext.Categories on q.CategoryId equals c.Id
            join g in _dbContext.Games on q.Id equals g.CurrentQuestionId
            where (q.Id == currentQuestionId)
            select new ViewModel.Question(g.Id,
                q.Title,
                q.Answers,
                c.Name,
                c.Id,
                g.CurrentQuestionStartTime,
                g.SecondsPerQuestion
            )
        ).FirstOrDefault();
    }

    private ViewModel.QuestionWithAnswer? GetCurrentQuestionWithAnswer(Guid gameId)
    {
        return (
            from q in _dbContext.Questions
            join c in _dbContext.Categories on q.CategoryId equals c.Id
            join g in _dbContext.Games on q.Id equals g.CurrentQuestionId
            select new ViewModel.QuestionWithAnswer(
                q.Id,
                q.Title,
                q.Answers,
                c.Name,
                c.Id,
                g.CurrentQuestionStartTime,
                g.SecondsPerQuestion,
                q.CorrectAnswer
            )
        ).FirstOrDefault();
    }

    private Guid CurrentQuestionId(Guid gameId)
    {
        var currentQuestionId = _dbContext.Games
            .Where(g => g.Id == gameId)
            .Select(g => g.CurrentQuestionId)
            .FirstOrDefault();
        return currentQuestionId;
    }

    private GameState GetState(Guid gameId)
    {
        return _dbContext.Games
            .Where(g => g.Id == gameId)
            .Select(g => g.State)
            .FirstOrDefault();
    }

    private ViewModel.Player[] GetPlayers(Guid gameId)
    {
        return _dbContext.Players
            .Where(p => p.GameId == gameId)
            .Select(p => GetViewModel(p))
            .ToArray();
    }

    private ViewModel.Player? GetPlayer(Guid playerId)
    {
        return _dbContext.Players
            .Where(p => p.Id == playerId)
            .Select(p => GetViewModel(p))
            .FirstOrDefault();
    }

    public Guid GetGameIdByPlayer(Guid playerId)
    {
        return _dbContext.Players
            .Where(p => p.Id == playerId)
            .Select(p => p.GameId)
            .FirstOrDefault();
    }

    public ViewModel.GameOptions? GetGameOptions(Guid gameId)
    {
        return _dbContext.Games
            .Where(g => g.Id == gameId)
            .Select(g => new ViewModel.GameOptions(gameId,
                g.Title,
                g.RandomizeQuestions,
                g.RandomizeAnswers,
                g.SecondsPerQuestion
            ))
            .FirstOrDefault();
    }

    public async Task UpdateGameOptions(Guid gameId, ViewModel.GameOptions options)
    {
        var game = _dbContext.Games.FirstOrDefault(g => g.Id == gameId);
        if (game == null) return;
        game.Title = options.Title;
        game.RandomizeQuestions = options.RandomizeQuestions;
        game.RandomizeAnswers = options.RandomizeAnswers;
        game.SecondsPerQuestion = options.SecondsPerQuestion;
        await _dbContext.SaveChangesAsync();
    }

    public async Task<ViewModel.Question?> SendNextQuestion(Guid gameId)
    {
        var game = _dbContext.Games.FirstOrDefault(g => g.Id == gameId);
        if (game == null) return null;

        game.ShareKey = string.Empty;
        game.State = GameState.QuestionInProgress;

        var gameComplete = game.RemainingQuestions?.Count == 0;
        if (gameComplete)
        {
            await HandleGameComplete(game);
            return null;
        }

        var nextQuestion = GetNextQuestion(game);
        if (nextQuestion == null)
            return null;

        var timestamp = DateTime.Now;

        game.CurrentQuestionId = nextQuestion.Id;
        game.CurrentQuestionStartTime = timestamp;
        game.CurrentQuestionNumber++;
        game.RemainingQuestions?.Remove(nextQuestion.Id);
        await _dbContext.SaveChangesAsync();
        nextQuestion.StartTime = timestamp;
        nextQuestion.Seconds = game.SecondsPerQuestion;

        await UpdateDashboardState(gameId);
        var clients = _playerHubContext.Clients.Group(game.Id.ToString());
        await clients.ReceiveNewQuestion(nextQuestion);
        await clients.ReceiveGameState(GameState.QuestionInProgress);
        return nextQuestion;
    }

    private ViewModel.Question? GetNextQuestion(Game game)
    {
        var nextQuestionId = game.RandomizeQuestions
            ? game.RemainingQuestions?[_random.Next(game.RemainingQuestions.Count)]
            : game.RemainingQuestions?.First();

        if (nextQuestionId == null)
            return null;

        return (
            from q in _dbContext.Questions
            join c in _dbContext.Categories on q.CategoryId equals c.Id
            join g in _dbContext.Games on q.Id equals nextQuestionId
            where (q.Id == nextQuestionId)
            select new ViewModel.Question(
                q.Id,
                q.Title,
                q.Answers,
                c.Name,
                c.Id,
                g.CurrentQuestionStartTime,
                g.SecondsPerQuestion
            )
        ).FirstOrDefault();
    }

    private async Task HandleGameComplete(Game game)
    {
        game.State = GameState.GameComplete;
        game.CurrentQuestionId = Guid.Empty;
        game.CurrentQuestionStartTime = DateTime.MinValue;
        await _dbContext.SaveChangesAsync();

        var clients = _playerHubContext.Clients.Group(game.Id.ToString());
        await clients.ReceiveLeaderBoard(GetLeaderBoard(game.Id));
        await clients.ReceiveGameState(game.State);
        await UpdateDashboardState(game.Id);
    }

    public async Task SendLeaderboard(Guid gameId)
    {
        var game = _dbContext.Games.FirstOrDefault(g => g.Id == gameId);
        if (game == null) return;
        game.ShareKey = string.Empty;
        game.State = GameState.ShowLeaderboard;
        await _dbContext.SaveChangesAsync();

        var clients = _playerHubContext.Clients.Groups(game.Id.ToString());
        await clients.ReceiveLeaderBoard(GetLeaderBoard(game.Id));
        await clients.ReceiveGameState(GameState.ShowLeaderboard);
        await UpdateDashboardState(gameId);
    }

    public async Task SendChatMessage(Guid gameId, string message, string sender)
    {
        await _playerHubContext.Clients
            .Group(gameId.ToString())
            .ReceiveChat(message, sender);

        await _dashboardHubContext.Clients
            .Group("dashboard_" + gameId)
            .ReceiveChat(message, sender);
    }

    private ViewModel.Player[] GetLeaderBoard(Guid gameId)
    {
        return _dbContext.Players
            .Where(p => p.GameId == gameId)
            .OrderByDescending(p => p.Score)
            .Select(p => GetViewModel(p))
            .ToArray();
    }

    private static ViewModel.Player GetViewModel(Player player)
    {
        return new ViewModel.Player(player.Id, player.Name, player.Score);
    }
}
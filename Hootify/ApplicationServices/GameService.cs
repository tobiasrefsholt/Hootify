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

    public async Task<Guid?> GetGameByPin(string shareKey)
    {
        var dbGame = await _dbContext.Games.FirstOrDefaultAsync(g => g.ShareKey == shareKey);
        return dbGame?.Id;
    }

    public async Task<ViewModel.Player?> AddPlayerToGame(Guid gameId, ViewModel.Player player)
    {
        var gameExists = await _dbContext.Games.AnyAsync(g => g.Id == gameId);
        if (!gameExists) return null;

        var dbPlayer = new Player
        {
            Id = Guid.NewGuid(),
            GameId = gameId,
            Name = player.Name,
            Score = 0
        };

        _dbContext.Players.Add(dbPlayer);
        await _dbContext.SaveChangesAsync();

        return new ViewModel.Player(dbPlayer.Id, dbPlayer.Name, dbPlayer.Score);
    }

    public async Task SendGameData(Guid playerId)
    {
        var gameId = await GetGameIdByPlayer(playerId);
        var gameState = await GetState(gameId);
        var recipientGroup = playerId.ToString();
        await SendGameState(gameState, recipientGroup);

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
                await SendWaitingPlayers(gameId, recipientGroup);
                break;
        }
    }

    private async Task SendGameState(GameState gameState, string recipientGroup)
    {
        var clients = _playerHubContext.Clients.Group(recipientGroup);
        await clients.ReceiveGameState(gameState);
    }

    private async Task SendQuestion(Guid gameId, string recipientGroup)
    {
        var currentQuestion = await GetCurrentQuestion(gameId);
        var clients = _playerHubContext.Clients.Group(recipientGroup);
        await clients.ReceiveNewQuestion(currentQuestion);
    }

    private async Task SendAnswer(Guid gameId, string recipientGroup)
    {
        var questionWithAnswer = await GetCurrentQuestionWithAnswer(gameId);
        var clients = _playerHubContext.Clients.Group(recipientGroup);
        await clients.ReceiveAnswer(questionWithAnswer);
    }

    public async Task SendLeaderBoard(Guid gameId, string recipientGroup)
    {
        var leaderBoard = await GetLeaderBoard(gameId);
        var clients = _playerHubContext.Clients.Group(recipientGroup);
        await clients.ReceiveLeaderBoard(leaderBoard);
    }

    private async Task SendGameComplete(Guid gameId, string recipientGroup)
    {
        var leaderBoard = await GetLeaderBoard(gameId);
        var clients = _playerHubContext.Clients.Group(recipientGroup);
        await clients.ReceiveLeaderBoard(leaderBoard);
        await clients.ReceiveGameState(GameState.GameComplete);
    }

    private async Task SendWaitingPlayers(Guid gameId, string recipientGroup)
    {
        var players = await GetPlayers(gameId);
        var clients = _playerHubContext.Clients.Group(recipientGroup);
        await clients.ReceiveLeaderBoard(players);
    }

    public async Task UpdateDashboardState(Guid gameId)
    {
        var recipientGroup = "dashboard_" + gameId;
        var client = _dashboardHubContext.Clients.Group(recipientGroup);
        await client.ReceiveGameState(await GetState(gameId));
        await client.ReceiveAnswer(await GetCurrentQuestionWithAnswer(gameId));
        await client.ReceiveLeaderBoard(await GetLeaderBoard(gameId));
        await client.ReceiveGameOptions(await GetGameOptions(gameId));
    }

    public async Task BroadcastChatMessage(Guid gameId, string message, string sender)
    {
        await _playerHubContext.Clients
            .Group(gameId.ToString())
            .ReceiveChat(message, sender);

        await _dashboardHubContext.Clients
            .Group("dashboard_" + gameId)
            .ReceiveChat(message, sender);
    }

    public async Task SendWelcomeMessage(Guid playerId, Guid gameId, string connectionId)
    {
        var player = await GetPlayer(playerId);
        var message = $"{player!.Name} has joined the game!";

        var playerClients = _playerHubContext
            .Clients
            .GroupExcept(gameId.ToString(), connectionId);

        await playerClients.ReceiveLeaderBoard(await GetLeaderBoard(gameId));
        await playerClients.ReceiveMessage(message);

        await _dashboardHubContext.Clients
            .Group("dashboard_" + gameId)
            .ReceiveMessage(message);
    }

    public async Task SendDisconnectMessage(Guid playerId)
    {
        var player = await GetPlayer(playerId);
        var gameId = await GetGameIdByPlayer(playerId);
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
        if (!await CanAnswerQuestion(playerId, gameId, questionId))
        {
            await _playerHubContext.Clients.Group(playerId.ToString()).ReceiveMessage("Failed to answer question");
            return;
        }

        // Check if answer is correct, update player score and send message
        await CheckAnswer(playerId, questionId, answer);

        // Send updated leaderboard to dashboard
        var dashboardHub = _dashboardHubContext.Clients.Group("dashboard_" + gameId);
        await dashboardHub.ReceiveLeaderBoard(await GetLeaderBoard(gameId));

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
        var answerIsCorrect = await _dbContext.Questions
            .Where(q => q.Id == questionId)
            .Select(q => q.CorrectAnswer)
            .FirstOrDefaultAsync() == answer;

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

    private async Task<bool> CanAnswerQuestion(Guid playerId, Guid gameId, Guid questionId)
    {
        var game = await _dbContext.Games.FirstOrDefaultAsync(g => g.Id == gameId);
        var timestamp = GetUnixTimeMilliseconds();
        if (game == null ||
            // Question is not the current question
            game.CurrentQuestionId != questionId ||
            // Question has expired
            game.CurrentQuestionStartTime + game.SecondsPerQuestion * 1000 < timestamp ||
            // Question has not started
            game.CurrentQuestionStartTime > timestamp ||
            // Game is not in progress
            game.State != GameState.QuestionInProgress)
            return false;

        // Player has already answered this question
        var answerExists =
            await _dbContext.GameAnswers.AnyAsync(a => a.QuestionId == questionId && a.PlayerId == playerId);
        if (answerExists) return false;

        // Player and question exist
        return await _dbContext.Players.AnyAsync(p => p.Id == playerId)
               && await _dbContext.Questions.AnyAsync(q => q.Id == questionId);
    }

    private async Task CheckIfAllPlayersAnswered(Guid gameId, Guid questionId)
    {
        var players = await _dbContext.Players
            .Where(p => p.GameId == gameId)
            .Select(p => p.Id)
            .ToArrayAsync();

        var answers = await _dbContext.GameAnswers
            .Where(a => a.GameId == gameId && a.QuestionId == questionId)
            .Select(a => a.PlayerId)
            .ToArrayAsync();

        if (!players.All(p => answers.Contains(p))) return;

        await PushFinishedQuestion(gameId);
    }

    public async Task PushFinishedQuestion(Guid gameId)
    {
        // Update game state to show answer
        await _dbContext.Games
            .Where(g => g.Id == gameId)
            .ExecuteUpdateAsync(b =>
                b.SetProperty(g => g.State, GameState.ShowAnswer)
            );

        // Send answer to players
        var currentQuestionWithAnswer = await GetCurrentQuestionWithAnswer(gameId);
        var clients = _playerHubContext.Clients.Group(gameId.ToString());
        await clients.ReceiveAnswer(currentQuestionWithAnswer);
        await clients.ReceiveGameState(GameState.ShowAnswer);

        // Update dashboard state
        await UpdateDashboardState(gameId);
    }

    public async Task PushLeaderBoard(Guid gameId)
    {
        var game = await _dbContext.Games.FirstOrDefaultAsync(g => g.Id == gameId);
        if (game == null) return;
        game.ShareKey = string.Empty;
        game.State = GameState.ShowLeaderboard;
        await _dbContext.SaveChangesAsync();

        var clients = _playerHubContext.Clients.Groups(game.Id.ToString());
        await clients.ReceiveLeaderBoard(await GetLeaderBoard(game.Id));
        await clients.ReceiveGameState(GameState.ShowLeaderboard);
        await UpdateDashboardState(gameId);
    }

    private async Task<ViewModel.Question?> GetCurrentQuestion(Guid gameId)
    {
        return await (
            from q in _dbContext.Questions
            join c in _dbContext.Categories on q.CategoryId equals c.Id
            join g in _dbContext.Games on q.Id equals g.CurrentQuestionId
            where (g.Id == gameId)
            select new ViewModel.Question(
                q.Id,
                q.Title,
                q.Answers,
                c.Name,
                c.Id,
                g.CurrentQuestionStartTime,
                g.SecondsPerQuestion
            )
        ).FirstOrDefaultAsync();
    }

    private async Task<ViewModel.QuestionWithAnswer?> GetCurrentQuestionWithAnswer(Guid gameId)
    {
        return await (
            from q in _dbContext.Questions
            join c in _dbContext.Categories on q.CategoryId equals c.Id
            join g in _dbContext.Games on q.Id equals g.CurrentQuestionId
            where g.Id == gameId
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
        ).FirstOrDefaultAsync();
    }

    private async Task<Guid?> CurrentQuestionId(Guid gameId)
    {
        var currentQuestionId = await _dbContext.Games
            .Where(g => g.Id == gameId)
            .Select(g => g.CurrentQuestionId)
            .FirstOrDefaultAsync();
        return currentQuestionId;
    }

    private async Task<GameState> GetState(Guid gameId)
    {
        return await _dbContext.Games
            .Where(g => g.Id == gameId)
            .Select(g => g.State)
            .FirstOrDefaultAsync();
    }

    private async Task<ViewModel.Player[]> GetPlayers(Guid gameId)
    {
        return await _dbContext.Players
            .Where(p => p.GameId == gameId)
            .Select(p => GetViewModel(p))
            .ToArrayAsync();
    }

    private async Task<ViewModel.Player?> GetPlayer(Guid playerId)
    {
        return await _dbContext.Players
            .Where(p => p.Id == playerId)
            .Select(p => GetViewModel(p))
            .FirstOrDefaultAsync();
    }

    public async Task<Guid> GetGameIdByPlayer(Guid playerId)
    {
        return await _dbContext.Players
            .Where(p => p.Id == playerId)
            .Select(p => p.GameId)
            .FirstOrDefaultAsync();
    }

    public async Task<ViewModel.GameOptions?> GetGameOptions(Guid gameId)
    {
        return await _dbContext.Games
            .Where(g => g.Id == gameId)
            .Select(g => new ViewModel.GameOptions(gameId,
                g.Title,
                g.RandomizeQuestions,
                g.RandomizeAnswers,
                g.SecondsPerQuestion
            ))
            .FirstOrDefaultAsync();
    }

    public async Task UpdateGameOptions(Guid gameId, ViewModel.GameOptions options)
    {
        var game = await _dbContext.Games.FirstOrDefaultAsync(g => g.Id == gameId);
        if (game == null) return;
        game.Title = options.Title;
        game.RandomizeQuestions = options.RandomizeQuestions;
        game.RandomizeAnswers = options.RandomizeAnswers;
        game.SecondsPerQuestion = options.SecondsPerQuestion;
        await _dbContext.SaveChangesAsync();
    }

    public async Task PushNextQuestion(Guid gameId)
    {
        var game = await _dbContext.Games.FirstOrDefaultAsync(g => g.Id == gameId);
        if (game == null) return;

        game.ShareKey = string.Empty;
        game.State = GameState.QuestionInProgress;

        var gameComplete = game.RemainingQuestions?.Count == 0;
        if (gameComplete)
        {
            await HandleGameComplete(game);
            return;
        }

        var nextQuestion = await GetNextQuestion(game);
        if (nextQuestion == null)
            return;

        var timestamp = GetUnixTimeMilliseconds();

        game.CurrentQuestionId = nextQuestion.Id;
        game.CurrentQuestionStartTime = timestamp;
        game.CurrentQuestionNumber++;
        game.RemainingQuestions?.Remove(nextQuestion.Id);
        await _dbContext.SaveChangesAsync();
        nextQuestion.StartTime = timestamp;
        nextQuestion.Seconds = game.SecondsPerQuestion;

        await UpdateDashboardState(gameId);
        await SendGameState(GameState.QuestionInProgress, gameId.ToString());
        await SendQuestion(gameId, gameId.ToString());
    }

    private async Task<ViewModel.Question?> GetNextQuestion(Game game)
    {
        var nextQuestionId = game.RandomizeQuestions
            ? game.RemainingQuestions?[_random.Next(game.RemainingQuestions.Count)]
            : game.RemainingQuestions?.First();

        if (nextQuestionId == null)
            return null;

        return await (
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
        ).FirstOrDefaultAsync();
    }

    private async Task HandleGameComplete(Game game)
    {
        game.State = GameState.GameComplete;
        game.CurrentQuestionId = Guid.Empty;
        game.CurrentQuestionStartTime = GetUnixTimeMilliseconds();
        await _dbContext.SaveChangesAsync();

        var clients = _playerHubContext.Clients.Group(game.Id.ToString());
        await clients.ReceiveLeaderBoard(await GetLeaderBoard(game.Id));
        await clients.ReceiveGameState(game.State);
        await UpdateDashboardState(game.Id);
    }

    private async Task<ViewModel.Player[]> GetLeaderBoard(Guid gameId)
    {
        return await _dbContext.Players
            .Where(p => p.GameId == gameId)
            .OrderByDescending(p => p.Score)
            .Select(p => GetViewModel(p))
            .ToArrayAsync();
    }

    private static ViewModel.Player GetViewModel(Player player)
    {
        return new ViewModel.Player(player.Id, player.Name, player.Score);
    }

    private static long GetUnixTimeMilliseconds()
    {
        return DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
    }
}
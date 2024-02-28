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

        return new ViewModel.Player
        {
            Id = dbPlayer.Id,
            Name = dbPlayer.Name,
            Score = dbPlayer.Score
        };
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
    }

    private async Task SendWaitingPlayers(Guid gameId, string recipientGroup)
    {
        var players = GetPlayers(gameId);
        var clients = _playerHubContext.Clients.Group(recipientGroup);
        await clients.ReceiveGameState(GameState.WaitingForPlayers);
        await clients.ReceiveLeaderBoard(players);
    }

    private async Task SendQuestion(Guid gameId, string recipientGroup)
    {
        var currentQuestion = GetCurrentQuestion(gameId);
        // Check if question has expired and handle it
        if (currentQuestion?.StartTime.AddSeconds(currentQuestion.Seconds) < DateTime.Now)
        {
            await HandleFinishedQuestion(gameId, gameId);
            return;
        }

        var clients = _playerHubContext.Clients.Group(recipientGroup);
        await clients.ReceiveNewQuestion(currentQuestion);
        await clients.ReceiveGameState(GameState.QuestionInProgress);
    }

    private async Task SendAnswer(Guid gameId, string recipientGroup)
    {
        var questionWithAnswer = GetCurrentQuestionWithAnswer(gameId);
        var clients = _playerHubContext.Clients.Group(recipientGroup);
        await clients.ReceiveAnswer(questionWithAnswer);
        await clients.ReceiveGameState(GameState.ShowAnswer);
    }

    private async Task SendLeaderBoard(Guid gameId, string recipientGroup)
    {
        var leaderBoard = GetLeaderBoard(gameId);
        var clients = _playerHubContext.Clients.Group(recipientGroup);
        await clients.ReceiveLeaderBoard(leaderBoard);
        await clients.ReceiveGameState(GameState.ShowLeaderboard);
    }

    private async Task SendGameComplete(Guid gameId, string recipientGroup)
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

        await CheckAnswer(playerId, questionId, answer);
        var dashboardHub = _dashboardHubContext.Clients.Group("dashboard_" + gameId);
        await dashboardHub.ReceiveLeaderBoard(GetLeaderBoard(gameId));

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

        await HandleFinishedQuestion(gameId, gameId);
    }

    private async Task HandleFinishedQuestion(Guid gameId, Guid group)
    {
        await _dbContext.Games
            .Where(g => g.Id == gameId)
            .ExecuteUpdateAsync(b =>
                b.SetProperty(g => g.State, GameState.ShowAnswer)
            );
        var currentQuestionWithAnswer = GetCurrentQuestionWithAnswer(gameId);
        var clients = _playerHubContext.Clients.Group(group.ToString());
        await clients.ReceiveAnswer(currentQuestionWithAnswer);
        await clients.ReceiveGameState(GameState.ShowAnswer);
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

        return (
            from q in _dbContext.Questions
            join c in _dbContext.Categories on q.CategoryId equals c.Id
            join g in _dbContext.Games on q.Id equals g.CurrentQuestionId
            where (q.Id == currentQuestionId)
            select new ViewModel.QuestionWithAnswer
            {
                Id = q.Id,
                Title = q.Title,
                Answers = q.Answers,
                CorrectAnswer = q.CorrectAnswer,
                Category = c.Name,
                CategoryId = c.Id,
                StartTime = g.CurrentQuestionStartTime,
                Seconds = g.SecondsPerQuestion
            }
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

    public ViewModel.Game New(ViewModel.GameOptions gameOptions)
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
        var viewGame = Get(gameId);
        return viewGame ?? throw new Exception("Game not found");
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

    private ViewModel.Question? GetNextQuestion([DisallowNull] Game game)
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

    private async Task HandleGameComplete(Game game)
    {
        game.State = GameState.GameComplete;
        await _dbContext.SaveChangesAsync();
        
        var clients = _playerHubContext.Clients.Group(game.Id.ToString());
        await clients.ReceiveLeaderBoard(GetLeaderBoard(game.Id));
        await clients.ReceiveGameState(game.State);
    }

    public ViewModel.Game? Get(Guid gameId)
    {
        return _dbContext.Games
            .Where(g => g.Id == gameId)
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
            return _dbContext.Games
                .Select(g => GetViewModel(g))
                .ToList();

        return _dbContext.Games
            .Where(g => g.State == gameState)
            .Select(g => GetViewModel(g))
            .ToList();
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

    private static ViewModel.Player GetViewModel(DbModel.Player player)
    {
        return new ViewModel.Player
        {
            Id = player.Id,
            Name = player.Name,
            Score = player.Score
        };
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
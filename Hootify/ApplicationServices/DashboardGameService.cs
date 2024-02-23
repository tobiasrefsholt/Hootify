using System.Diagnostics.CodeAnalysis;
using Hootify.DbModel;
using Microsoft.AspNetCore.SignalR;
using Question = Hootify.ViewModel.Question;

namespace Hootify.ApplicationServices;

public class DashboardGameService
{
    private readonly AppDbContext _dbContext;
    private readonly IHubContext<GameHub, IGameHub> _gameHubContext;
    private readonly Random _random = new();

    public DashboardGameService(AppDbContext dbContext, IHubContext<GameHub, IGameHub> gameHubContext)
    {
        _dbContext = dbContext;
        _gameHubContext = gameHubContext;
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

    public async Task<Question?> SendNextQuestion(Guid gameId)
    {
        var game = _dbContext.Games.FirstOrDefault(g => g.Id == gameId);
        if (game == null) return null;

        game.ShareKey = string.Empty;
        game.State = GameState.QuestionInProgress;

        var gameComplete = game.RemainingQuestions?.Count == 0;
        if (gameComplete)
            await HandleGameComplete(game);

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
        await _gameHubContext.Clients.Groups(game.Id.ToString())
            .ReceiveNewQuestion(game.State, nextQuestion);
        return nextQuestion;
    }

    private Question? GetNextQuestion([DisallowNull] Game game)
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
            select new Question
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
        await _gameHubContext.Clients.Groups(game.Id.ToString())
            .ReceiveGameComplete(game.State);
        await _dbContext.SaveChangesAsync();
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
                RemainingQuestions = g.RemainingQuestions,
            })
            .FirstOrDefault();
    }

    public List<Guid> GetAll(GameState? gameState)
    {
        if (gameState == null)
            return _dbContext.Games
                .Select(g => g.Id)
                .ToList();

        return _dbContext.Games
            .Where(g => g.State == gameState)
            .Select(g => g.Id)
            .ToList();
    }
}
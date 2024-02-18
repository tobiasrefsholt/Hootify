using Hootify.DbModel;
using Microsoft.AspNetCore.SignalR;

namespace Hootify.ApplicationServices;

public class DashboardGameService
{
    private readonly AppDbContext _dbContext;
    private readonly Random _random = new Random();

    public DashboardGameService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Guid New(ViewModel.GameOptions gameOptions)
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
        return gameId;
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

    public async Task<bool> Start(Guid gameId, IHubContext<GameHub, IGameHub> gameHubContext)
    {
        var game = _dbContext.Games.FirstOrDefault(g => g.Id == gameId);
        if (game == null) return false;

        game.ShareKey = string.Empty;
        NextQuestion(gameId, gameHubContext);
        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async void NextQuestion(Guid gameId, IHubContext<GameHub, IGameHub> gameHubContext)
    {
        var game = _dbContext.Games.FirstOrDefault(g => g.Id == gameId);
        if (game == null) return;

        game.State = GameState.QuestionInProgress;

        if (game.RemainingQuestions?.Count == 0)
        {
            game.State = GameState.GameComplete;
            return;
        }

        var nextQuestionId = game.RandomizeQuestions
            ? game.RemainingQuestions?[_random.Next(game.RemainingQuestions.Count)]
            : game.RemainingQuestions?.First();

        if (nextQuestionId == null) return;

        var nextQuestion = _dbContext.Questions
            .Where(q => q.Id == (Guid)nextQuestionId)
            .Select(q => new ViewModel.Question
            {
                Id = q.Id,
                Title = q.Title,
                Answers = q.Answers
            })
            .FirstOrDefault();

        if (nextQuestion == null) return;

        game.RemainingQuestions?.Remove((Guid)nextQuestionId);

        await gameHubContext.Clients.Groups(game.Id.ToString())
            .ReceiveNewQuestion(GameState.QuestionInProgress, nextQuestion);
    }
}
using Hootify.ApplicationServices;
using Hootify.DbModel;
using Hootify.ViewModel;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Player = Hootify.DbModel.Player;
using Question = Hootify.ViewModel.Question;

namespace Hootify;

public sealed class GameHub(AppDbContext dbContext) : Hub<IGameHub>
{
    public async Task BroadcastMessage(string message)
    {
        Console.WriteLine(message);
        await Clients.All.ReceiveMessage(message);
    }

    public async Task SendChatMessage(string message, string sender)
    {
        Console.WriteLine(message);
        var playerId = await GetPlayerId();
        var gameId = GetGameId(playerId).ToString();
        await Clients.Group(gameId).ReceiveChat(message, sender);
    }

    public async Task AnswerQuestion(Guid questionId, int answerIndex)
    {
        var playerId = await GetPlayerId();
        var gameId = GetGameId(playerId);

        // Handle answer
        var playerService = new PlayerService(dbContext);
        var isAnswered = playerService.AnswerQuestion(playerId, gameId, questionId, answerIndex);
        var allPlayersAnswered = playerService.AllPlayersAnswered(gameId, questionId);

        // Send response to player
        var message = isAnswered ? "Answer is recorded" : "Cannot answer question";
        await Clients.Group(playerId.ToString()).ReceiveMessage(message);

        // If all players have answered, move to next question
        if (allPlayersAnswered)
        {
            await dbContext.Games
                .Where(g => g.Id == gameId)
                .ExecuteUpdateAsync(b =>
                    b.SetProperty(g => g.State, GameState.QuestionComplete)
                );
            await QuestionComplete();
        }
    }

    private async Task WaitingPlayers(Guid gameId)
    {
        var gameState = dbContext.Games
            .Where(g => g.Id == gameId)
            .Select(g => g.State)
            .FirstOrDefault();

        var players = dbContext.Players
            .Where(p => p.GameId == gameId)
            .Select(p => new ViewModel.Player
            {
                Id = p.Id,
                Name = p.Name,
                Score = p.Score
            })
            .ToArray();

        await Clients.Group(gameId.ToString()).ReceiveWaitingPlayers(gameState, players);
    }

    private async Task CurrentQuestion()
    {
        var playerId = await GetPlayerId();
        var gameId = GetGameId(playerId);
        var playerService = new PlayerService(dbContext);
        var question = playerService.GetCurrentQuestion(gameId);
        if (question == null) return;
        await Clients.Groups(playerId.ToString()).ReceiveNewQuestion(GameState.QuestionInProgress, question);
    }

    private async Task QuestionComplete()
    {
        var playerId = await GetPlayerId();
        var gameId = GetGameId(playerId);

        var playerService = new PlayerService(dbContext);
        var questionWithAnswer = playerService.GetCurrentQuestionWithAnswer(gameId);

        if (questionWithAnswer == null) return;
        await Clients.Group(gameId.ToString()).ReceiveAnswer(GameState.QuestionComplete, questionWithAnswer);
    }

    private async Task GameComplete()
    {
        var playerId = await GetPlayerId();
        var gameId = GetGameId(playerId);
        var playerService = new PlayerService(dbContext);
        var leaderBoard = playerService.GetLeaderBoard(gameId);
        await Clients.Group(playerId.ToString()).ReceiveLeaderBoard(GameState.GameComplete, leaderBoard);
    }

    public override async Task OnConnectedAsync()
    {
        var playerId = await GetPlayerId();
        var player = await FetchPlayerFromDb(playerId);

        // Add the player to the group for the game they are in
        await Groups.AddToGroupAsync(Context.ConnectionId, player!.GameId.ToString());
        await Groups.AddToGroupAsync(Context.ConnectionId, player.Id.ToString());

        await BroadcastMessage($"{player.Name}! has joined the game!");

        var gameState = dbContext.Games
            .Where(g => g.Id == GetGameId(playerId))
            .Select(g => g.State)
            .FirstOrDefault();

        switch (gameState)
        {
            case GameState.QuestionInProgress:
                await CurrentQuestion();
                break;
            case GameState.QuestionComplete:
                await QuestionComplete();
                break;
            case GameState.GameComplete:
                await GameComplete();
                break;
            case GameState.WaitingForPlayers:
            default:
                await WaitingPlayers(player.GameId);
                break;
        }

        await base.OnConnectedAsync();
    }

    private async Task<Player?> FetchPlayerFromDb(Guid playerId)
    {
        var player = dbContext.Players.FirstOrDefault(p => p.Id == playerId);
        if (player != null) return player;

        await Clients.Client(Context.ConnectionId).ReceiveMessage("Cannot find player with that id");
        Context.Abort();
        return null;
    }

    private async Task<Guid> GetPlayerId()
    {
        var playerIdString = Context.GetHttpContext()?.Request.Query["playerId"].ToString();
        var isValidGuid = Guid.TryParse(playerIdString, out var playerId);
        if (isValidGuid) return playerId;

        await Clients.Client(Context.ConnectionId).ReceiveMessage("Not a valid player id");
        Context.Abort();
        return Guid.Empty;
    }

    private Guid GetGameId(Guid playerId)
    {
        var gameId = dbContext.Players
            .Where(p => p.Id == playerId)
            .Select(p => p.GameId)
            .FirstOrDefault();
        return gameId;
    }
}
using Hootify.ApplicationServices;
using Hootify.Hubs.ClientInterfaces;
using Microsoft.AspNetCore.SignalR;

namespace Hootify.Hubs;

public class PlayerHub : Hub<IPlayerHub>
{
    private readonly GameService _gameService;

    public PlayerHub(GameService gameService)
    {
        _gameService = gameService;
    }

    public override async Task OnConnectedAsync()
    {
        var playerId = await GetPlayerId();
        var gameId = await _gameService.GetGameIdByPlayer(playerId);
        if (playerId == Guid.Empty || gameId == Guid.Empty)
        {
            await Clients.Client(Context.ConnectionId).ReceiveMessage("Cannot find player with that id");
            Context.Abort();
        }

        await Groups.AddToGroupAsync(Context.ConnectionId, gameId.ToString());
        await Groups.AddToGroupAsync(Context.ConnectionId, playerId.ToString());
        
        await GetGameData(playerId);
        await _gameService.UpdateDashboardState(gameId);
        await _gameService.SendWelcomeMessage(playerId, gameId, Context.ConnectionId);

        await base.OnConnectedAsync();
    }
    
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var playerId = await GetPlayerId();
        await _gameService.SendDisconnectMessage(playerId);
        await base.OnDisconnectedAsync(exception);
    }

    public async Task AnswerQuestion(Guid questionId, int answerIndex)
    {
        var playerId = await GetPlayerId();
        var gameId = await _gameService.GetGameIdByPlayer(playerId);
        await _gameService.AnswerQuestion(playerId, gameId, questionId, answerIndex);
    }

    public async Task SendChatMessage(string message, string sender)
    {
        var playerId = await GetPlayerId();
        var gameId = await _gameService.GetGameIdByPlayer(playerId);
        await _gameService.BroadcastChatMessage(gameId, message, sender);
    }
    
    public async Task GetGameData(Guid playerId)
    {
        await _gameService.SendGameData(playerId);
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
}
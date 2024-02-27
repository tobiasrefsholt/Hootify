using Hootify.ApplicationServices;
using Hootify.Hubs.ClientInterfaces;
using Microsoft.AspNetCore.SignalR;

namespace Hootify.Hubs;

public class PlayerHub : GameHub<IPlayerHub>
{
    public PlayerHub(GameService gameService) : base(gameService)
    {
    }

    public override async Task OnConnectedAsync()
    {
        var playerId = await GetPlayerId();
        var gameId = GameService.GetGameIdByPlayer(playerId);
        if (playerId == Guid.Empty || gameId == Guid.Empty)
        {
            await Clients.Client(Context.ConnectionId).ReceiveMessage("Cannot find player with that id");
            Context.Abort();
        }

        await Groups.AddToGroupAsync(Context.ConnectionId, gameId.ToString());
        await Groups.AddToGroupAsync(Context.ConnectionId, playerId.ToString());
        await GameService.SendWelcomeMessage(playerId, gameId, Context.ConnectionId);
        await GetGameState(playerId);

        await base.OnConnectedAsync();
    }

    public async Task AnswerQuestion(Guid questionId, int answerIndex)
    {
        var playerId = await GetPlayerId();
        var gameId = GameService.GetGameIdByPlayer(playerId);
        await GameService.AnswerQuestion(playerId, gameId, questionId, answerIndex);
    }

    public async Task SendChatMessage(string message, string sender)
    {
        var playerId = await GetPlayerId();
        var gameId = GameService.GetGameIdByPlayer(playerId).ToString();
        await Clients.Group(gameId).ReceiveChat(message, sender);
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
using Hootify.DbModel;
using Microsoft.AspNetCore.SignalR;

namespace Hootify;

public sealed class GameHub(AppDbContext dbContext) : Hub<IGameHub>
{
    public async Task BroadcastMessage(string message)
    {
        Console.WriteLine(message);
        await Clients.All.ReceiveMessage(message);
    }

    public override async Task OnConnectedAsync()
    {
        var playerId = await GetPlayerId();
        var player = await FetchPlayerFromDb(playerId);

        // Add the player to the group for the game they are in
        await Groups.AddToGroupAsync(Context.ConnectionId, player!.GameId.ToString());
        await Groups.AddToGroupAsync(Context.ConnectionId, player.Id.ToString());

        await BroadcastMessage($"Hello, {player.Name}! Your connection id is " + Context.ConnectionId);

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
}
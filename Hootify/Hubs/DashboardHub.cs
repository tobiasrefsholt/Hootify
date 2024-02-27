using Hootify.ApplicationServices;
using Hootify.Hubs.ClientInterfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Hootify.Hubs;

[Authorize]
public class DashboardHub : GameHub<IDashboardHub>
{
    public DashboardHub(GameService gameService) : base(gameService)
    {
    }

    public override async Task OnConnectedAsync()
    {
        var gameId = await GetGameId();

        await Groups.AddToGroupAsync(Context.ConnectionId, "dashboard_" + gameId);

        await base.OnConnectedAsync();
    }

    public async Task SendNextQuestion()
    {
        var gameId = await GetGameId();
        await GameService.SendNextQuestion(gameId);
    }

    public async Task SendLeaderBoard()
    {
        var gameId = await GetGameId();
        await GameService.SendLeaderboard(gameId);
    }

    public async Task GetFullGameState()
    {
        var gameId = await GetGameId();
        await GameService.GetGameState(gameId);
    }

    private async Task<Guid> GetGameId()
    {
        var gameIdString = Context.GetHttpContext()?.Request.Query["gameId"].ToString();
        var isValidGuid = Guid.TryParse(gameIdString, out var gameId);
        if (isValidGuid) return gameId;

        await Clients.Client(Context.ConnectionId).ReceiveMessage("Cannot find player with that id");
        Context.Abort();
        return Guid.Empty;
    }
}
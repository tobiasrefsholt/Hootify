using Hootify.ApplicationServices;
using Hootify.Hubs.ClientInterfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Hootify.Hubs;

[Authorize]
public class DashboardHub : Hub<IDashboardHub>
{
    private readonly GameService _gameService;

    public DashboardHub(GameService gameService)
    {
        _gameService = gameService;
    }

    public override async Task OnConnectedAsync()
    {
        var gameId = await GetGameId();

        await Groups.AddToGroupAsync(Context.ConnectionId, "dashboard_" + gameId);
        await Clients.Group("dashboard_" + gameId).ReceiveMessage("Connected to dashboard hub!");
        await GetFullGameState();

        await base.OnConnectedAsync();
    }

    public async Task SendChatMessage(string message, string sender)
    {
        var gameId = await GetGameId();
        await _gameService.BroadcastChatMessage(gameId, message, sender);
    }

    public async Task SendNextQuestion()
    {
        var gameId = await GetGameId();
        await _gameService.PushNextQuestion(gameId);
    }

    public async Task SendLeaderBoard()
    {
        var gameId = await GetGameId();
        await _gameService.PushLeaderBoard(gameId);
    }
    
    public async Task SendAnswer()
    {
        var gameId = await GetGameId();
        await _gameService.PushFinishedQuestion(gameId);
    }

    public async Task GetFullGameState()
    {
        var gameId = await GetGameId();
        Console.WriteLine(gameId);
        await _gameService.UpdateDashboardState(gameId);
    }
    
    public async Task UpdateGameOptions(ViewModel.GameOptions options)
    {
        var gameId = await GetGameId();
        await _gameService.UpdateGameOptions(gameId, options);
        await Clients.Group("dashboard_" + gameId).ReceiveGameOptions(options);
        await Clients.Group("dashboard_" + gameId).ReceiveMessage("Game options updated");
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
using Hootify.ApplicationServices;
using Hootify.DbModel;
using Microsoft.AspNetCore.SignalR;

namespace Hootify.Hubs;

public abstract class GameHub<T> : Hub<T> where T : class
{
    protected readonly GameService GameService;

    protected GameHub(GameService gameService)
    {
        GameService = gameService;
    }

    public async Task GetGameState(Guid playerId)
    {
        await GameService.GetGameState(playerId);
    }
}
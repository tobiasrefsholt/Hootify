using Hootify.ApplicationServices;
using Player = Hootify.ViewModel.Player;

namespace Hootify.Endpoints;

public static class GameEndpoints
{
    public static IApplicationBuilder UseGameEndpoints(this IApplicationBuilder builder)
    {
        return builder.UseEndpoints(endpoints =>
        {
            endpoints.MapPost("/game/join/{shareKey}", async (string shareKey, Player player, GameService gameService) =>
            {
                var gameId = await gameService.GetGameByPin(shareKey);
                return gameId != null
                    ? await gameService.AddPlayerToGame((Guid)gameId, player)
                    : null;
            });
        });
    }
}
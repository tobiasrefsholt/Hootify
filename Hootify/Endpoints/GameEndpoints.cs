using Hootify.ApplicationServices;
using Player = Hootify.ViewModel.Player;

namespace Hootify.Endpoints;

public static class GameEndpoints
{
    public static IApplicationBuilder UseGameEndpoints(this IApplicationBuilder builder)
    {
        return builder.UseEndpoints(endpoints =>
        {
            endpoints.MapPost("/game/join/{shareKey}", (string shareKey, Player player, GameService gameService) =>
            {
                var gameId = gameService.GetGameByPin(shareKey);
                return gameId != null
                    ? gameService.AddPlayerToGame((Guid)gameId, player)
                    : null;
            });
        });
    }
}
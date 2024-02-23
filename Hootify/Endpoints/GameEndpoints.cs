using Hootify.ApplicationServices;
using Hootify.DbModel;
using Microsoft.AspNetCore.SignalR;
using Player = Hootify.ViewModel.Player;

namespace Hootify.Endpoints;

public static class GameEndpoints
{
    public static IApplicationBuilder UseGameEndpoints(this IApplicationBuilder builder)
    {
        return builder.UseEndpoints(endpoints =>
        {
            // Gets called when client enters game pin 
            // Takes gamePin and returns associated gameId
            endpoints.MapGet("/game/getByPin/{shareKey}", (string shareKey, PlayerService playerService) => playerService.GetGameByPin(shareKey));

            // Gets called when client enters username
            // Takes player object and updates database with new player
            // Subscribes player to game and returns player object
            endpoints.MapPost("/game/join/{shareKey}", (string shareKey, Player player, PlayerService playerService) =>
            {
                var game = playerService.GetGameByPin(shareKey);
                return game != null ? playerService.AddPlayerToGame(game.Id, player) : null;
            });
        });
    }
}
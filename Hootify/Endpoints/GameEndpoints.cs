using Hootify.ApplicationServices;
using Hootify.DbModel;
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
            endpoints.MapGet("/game/getByPin/{shareKey}", (string shareKey, AppDbContext dbContext) =>
            {
                var playerService = new PlayerService(dbContext);
                return playerService.GetGameByPin(shareKey);
            });

            // Gets called when client enters username
            // Takes player object and updates database with new player
            // Subscribes player to game and returns player object
            endpoints.MapPost("/game/join/{shareKey}", (string shareKey, Player player, AppDbContext dbContext) =>
            {
                var playerService = new PlayerService(dbContext);
                var game = playerService.GetGameByPin(shareKey);
                return game != null ? playerService.AddPlayerToGame(game.Id, player) : null;
            });
        });
    }
}
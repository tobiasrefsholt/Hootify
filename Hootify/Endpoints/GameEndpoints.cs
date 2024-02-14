using Hootify.ViewModel;

namespace Hootify.Endpoints;

public static class GameEndpoints
{
    public static IApplicationBuilder UseGameEndpoints( this IApplicationBuilder builder )
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
            
            endpoints.MapPost("/game/join/{game_id:int}", (Player player) =>
            {
                
            });
            
            endpoints.MapPost("game/answer", () =>
            {
                
            });
        });
    }
}
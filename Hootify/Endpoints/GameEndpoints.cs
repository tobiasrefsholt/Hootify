using Hootify.ViewModel;

namespace Hootify.Endpoints;

public static class GameEndpoints
{
    public static IApplicationBuilder UseGameEndpoints( this IApplicationBuilder builder )
    {
        return builder.UseEndpoints(endpoints =>
        {
            endpoints.MapGet("/game/{game_id:int}", () =>
            {
                
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
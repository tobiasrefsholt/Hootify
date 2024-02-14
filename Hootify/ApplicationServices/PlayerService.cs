using Hootify.DbModel;

namespace Hootify.ApplicationServices;

public class PlayerService
{
    private readonly AppDbContext _dbContext;
    
    public PlayerService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public ViewModel.Game? GetGameByPin(string shareKey)
    {
        var dbGame = _dbContext.Games.FirstOrDefault(g => g.ShareKey == shareKey);
        if (dbGame == null) return null;
        return new ViewModel.Game
        {
            Id = dbGame.Id,
            Title = dbGame.Title
        };
    }
}
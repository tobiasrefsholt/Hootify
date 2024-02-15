using Hootify.DbModel;
using Player = Hootify.ViewModel.Player;

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

    public Player? AddPlayerToGame(Guid gameId, Player player)
    {
        var gameExists = _dbContext.Games.Any(g => g.Id == gameId);
        if (!gameExists) return null;

        var dbPlayer = new DbModel.Player
        {
            Id = Guid.NewGuid(),
            GameId = gameId,
            Name = player.Name,
            Score = 0
        };

        _dbContext.Players.Add(dbPlayer);
        _dbContext.SaveChanges();

        return new Player
        {
            Id = dbPlayer.Id,
            Name = dbPlayer.Name,
            Score = dbPlayer.Score
        };
    }
}
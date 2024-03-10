namespace Hootify.DbModel;

public class Player
{
    public Guid Id { get; set; }
    public Guid GameId { get; set; }
    public string Name { get; set; }
    public int Score { get; set; }

    public Player(Guid id, Guid gameId, string name, int score)
    {
        Id = id;
        GameId = gameId;
        Name = name;
        Score = score;
    }

    public Player()
    {
    }
}
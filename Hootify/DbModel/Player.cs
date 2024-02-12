namespace Hootify.DbModel;

public class Player
{
    public Guid Id { get; set; }
    public Guid GameId { get; set; }
    public string Name { get; set; }
    public int Score { get; set; }
}
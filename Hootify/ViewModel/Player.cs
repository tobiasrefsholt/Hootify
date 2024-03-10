namespace Hootify.ViewModel;

public class Player
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public int Score { get; set; }

    public Player(Guid id, string name, int score)
    {
        Id = id;
        Name = name;
        Score = score;
    }

    public Player()
    {
    }
}
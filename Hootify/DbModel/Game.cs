namespace Hootify.DbModel;

public class Game
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public Guid[] Players { get; set; }
    public Guid QuizId { get; set; }
}
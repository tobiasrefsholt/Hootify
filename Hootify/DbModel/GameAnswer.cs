namespace Hootify.DbModel;

public class GameAnswer
{
    public Guid Id { get; set; }
    public Guid GameId { get; set; }
    public Guid PlayerId { get; set; }
    public Guid QuestionId { get; set; }
    public int Answer { get; set; }
}
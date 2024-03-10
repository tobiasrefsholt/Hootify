namespace Hootify.ViewModel;

public class GameAnswer
{
    public Guid Id { get; set; }
    public Guid GameId { get; set; }
    public Guid PlayerId { get; set; }
    public Guid QuestionId { get; set; }
    public int Answer { get; set; }

    public GameAnswer(Guid id, Guid gameId, Guid playerId, Guid questionId, int answer)
    {
        Id = id;
        GameId = gameId;
        PlayerId = playerId;
        QuestionId = questionId;
        Answer = answer;
    }

    public GameAnswer()
    {
    }
}
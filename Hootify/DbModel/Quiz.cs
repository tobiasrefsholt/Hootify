namespace Hootify.DbModel;

public class Quiz
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public List<Guid> QuestionIds { get; set; }
}
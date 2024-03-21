namespace Hootify.DbModel;

public class Quiz
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public List<Guid> QuestionIds { get; set; }
    public long UpdatedAt { get; set; }
    public long CreatedAt { get; set; }

    public Quiz(Guid id, Guid userId, string title, string description, List<Guid> questionIds, long updatedAt, long createdAt)
    {
        Id = id;
        UserId = userId;
        Title = title;
        Description = description;
        QuestionIds = questionIds;
        UpdatedAt = updatedAt;
        CreatedAt = createdAt;
    }

    public Quiz()
    {
    }
}
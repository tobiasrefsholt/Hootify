namespace Hootify.ViewModel;

public class Quiz
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public List<Guid> QuestionIds { get; set; }

    public Quiz(Guid id, string title, string description, List<Guid> questionIds)
    {
        Id = id;
        Title = title;
        Description = description;
        QuestionIds = questionIds;
    }

    public Quiz()
    {
    }
}
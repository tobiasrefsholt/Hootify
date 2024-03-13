namespace Hootify.ViewModel;

public class Question
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string[] Answers { get; set; }
    public string Category { get; set; }
    public Guid CategoryId { get; set; }
    public long StartTime { get; set; }
    public int Seconds { get; set; }

    public Question(Guid id, string title, string[] answers, string category, Guid categoryId, long startTime,
        int seconds)
    {
        Id = id;
        Title = title;
        Answers = answers;
        Category = category;
        CategoryId = categoryId;
        StartTime = startTime;
        Seconds = seconds;
    }

    public Question(Guid id, string title, string[] answers, string category, Guid categoryId)
    {
        Id = id;
        Title = title;
        Answers = answers;
        Category = category;
        CategoryId = categoryId;
    }

    public Question()
    {
    }
}
namespace Hootify.DbModel;

public class Question
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Title { get; set; }
    public string[] Answers { get; set; }
    public int CorrectAnswer { get; set; }
    public Guid CategoryId { get; set; }
    public long UpdatedAt { get; set; }
    public long CreatedAt { get; set; }

    public Question(Guid id, Guid userId, string title, string[] answers, int correctAnswer, Guid categoryId, long updatedAt, long createdAt)
    {
        Id = id;
        UserId = userId;
        Title = title;
        Answers = answers;
        CorrectAnswer = correctAnswer;
        CategoryId = categoryId;
        UpdatedAt = updatedAt;
        CreatedAt = createdAt;
    }

    public Question()
    {
    }
}
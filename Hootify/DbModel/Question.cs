namespace Hootify.DbModel;

public class Question
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string[] Answers { get; set; }
    public int CorrectAnswer { get; set; }
    public string Category { get; set; }
    public Guid CategoryId { get; set; }
}
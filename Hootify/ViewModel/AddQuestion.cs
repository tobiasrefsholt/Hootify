namespace Hootify.ViewModel;

public class AddQuestion
{
    public string Title { get; set; }
    public string[] Answers { get; set; }
    public int CorrectAnswer { get; set; }
    public Guid CategoryId { get; set; }
}
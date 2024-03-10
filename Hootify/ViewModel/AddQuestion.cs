namespace Hootify.ViewModel;

public class AddQuestion
{
    public string Title { get; set; }
    public string[] Answers { get; set; }
    public int CorrectAnswer { get; set; }
    public Guid CategoryId { get; set; }

    public AddQuestion(string title, string[] answers, int correctAnswer, Guid categoryId)
    {
        Title = title;
        Answers = answers;
        CorrectAnswer = correctAnswer;
        CategoryId = categoryId;
    }

    public AddQuestion()
    {
    }
}
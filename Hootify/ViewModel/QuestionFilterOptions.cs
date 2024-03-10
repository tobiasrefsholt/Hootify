namespace Hootify.ViewModel;

public class QuestionFilterOptions
{
    public Guid CategoryId { get; set; }
    public string Search { get; set; }

    public QuestionFilterOptions(Guid categoryId, string search)
    {
        CategoryId = categoryId;
        Search = search;
    }

    public QuestionFilterOptions()
    {
    }
}
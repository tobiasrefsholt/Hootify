namespace Hootify.DbModel;

public class Category
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Name { get; set; }

    public Category(Guid id, Guid userId, string name)
    {
        Id = id;
        UserId = userId;
        Name = name;
    }

    public Category()
    {
    }
}
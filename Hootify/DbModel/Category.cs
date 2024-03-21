namespace Hootify.DbModel;

public class Category
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Name { get; set; }
    public long UpdatedAt { get; set; }
    public long CreatedAt { get; set; }

    public Category(Guid id, Guid userId, string name, long updatedAt, long createdAt)
    {
        Id = id;
        UserId = userId;
        Name = name;
        UpdatedAt = updatedAt;
        CreatedAt = createdAt;
    }

    public Category()
    {
    }
}
namespace Hootify.ViewModel;

public class Question
{
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Title { get; set; }
        public string[] Answers { get; set; }
        public string Category { get; set; }
        public Guid CategoryId { get; set; }
        public DateTime StartTime { get; set; }
        public int Seconds { get; set; }
}
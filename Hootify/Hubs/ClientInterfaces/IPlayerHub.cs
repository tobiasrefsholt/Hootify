using Hootify.ViewModel;

namespace Hootify.Hubs.ClientInterfaces;

public interface IPlayerHub
{
    public Task ReceiveMessage(string message);
    public Task ReceiveChat(string message, string sender);
    public Task ReceiveGameState(GameState gameState);
    public Task ReceiveLeaderBoard(Player[] leaderBoard);
    public Task ReceiveNewQuestion(Question? question);
    public Task ReceiveAnswer(QuestionWithAnswer? questionWithAnswer);
}

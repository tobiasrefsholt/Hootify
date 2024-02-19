using Hootify.ViewModel;

namespace Hootify;

public interface IGameHub
{
    public Task ReceiveWaitingPlayers(GameState gameState, Player[] players);
    public Task ReceiveNewQuestion(GameState gameState, Question question);
    public Task ReceiveAnswer(GameState gameState, QuestionWithAnswer questionWithAnswer);
    public Task ReceiveLeaderBoard(GameState gameState, Player[] leaderBoard);
    public Task ReceiveGameComplete(GameState gameState);
    public Task ReceiveMessage(string message);
    public Task ReceiveChat(string message, string sender);
}

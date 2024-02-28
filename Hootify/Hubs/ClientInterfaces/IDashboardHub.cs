namespace Hootify.Hubs.ClientInterfaces;

public interface IDashboardHub : IPlayerHub
{
    public Task ReceiveGameOptions(ViewModel.GameOptions? options);
}
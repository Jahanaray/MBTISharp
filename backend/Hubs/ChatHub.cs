using Microsoft.AspNetCore.SignalR;

namespace MBTIMatch.Hubs;

public class ChatHub : Hub
{
    public async Task JoinMatch(string matchId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, matchId);
        await Clients.Caller.SendAsync("JoinedMatch", matchId);
    }

    public async Task LeaveMatch(string matchId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, matchId);
        await Clients.Caller.SendAsync("LeftMatch", matchId);
    }

    public async Task SendMessage(string matchId, string userId, string content)
    {
        var message = new
        {
            Id = Guid.NewGuid(),
            MatchId = matchId,
            SenderId = userId,
            Content = content,
            SentAt = DateTime.UtcNow
        };

        await Clients.Group(matchId).SendAsync("ReceiveMessage", message);
    }

    public override async Task OnConnectedAsync()
    {
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await base.OnDisconnectedAsync(exception);
    }
}

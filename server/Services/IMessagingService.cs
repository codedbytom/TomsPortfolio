using Vonage;
using Vonage.Common;
using Vonage.Messaging;
using Vonage.Request;

namespace server.Services
{
    public interface IMessagingService
    {
        Task<int> MessageSendPreCheck(string phoneNumber);
        Task SendMessageAsync(Models.Message message);
        Task<bool> IsContactOptedIn(string phoneNumber);
        Task<bool> HandleInbound(Models.DTO.VonageSmsPayload vonageSmsPayload);
    }
}
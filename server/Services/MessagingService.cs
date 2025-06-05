using System.Diagnostics;
using Vonage;
using Vonage.Messaging;
using server.data;
using Microsoft.EntityFrameworkCore;

namespace server.Services
{
    public class MessagingService : IMessagingService
    {
        private readonly VonageClient _VonageClient;
        private readonly string _fromNumber;
        private readonly ILogger<MessagingService> _logger;
        private readonly AppDbContext _context;

        public MessagingService(VonageClient vonageClient, string fromNumber, ILogger<MessagingService> logger, AppDbContext context)
        {
            Debug.WriteLine($"New SmsService created at {DateTime.Now}");
            Debug.WriteLine($"VonageClient hash: {vonageClient.GetHashCode()}");
            _VonageClient = vonageClient;
            _fromNumber = fromNumber;
            _logger = logger;
            _context = context;
        }

        public async Task<int> MessageSendPreCheck(string phoneNumber)
        {
            // Check if we've sent too many messages recently
            int messageCount = await _context.Messages
                .Where(m => m.PhoneNumber == phoneNumber && 
                            m.SentAt > DateTime.UtcNow.AddHours(-1))
                .CountAsync();
            return messageCount;
        }

        public async Task<bool> IsContactOptedIn(string phoneNumber)
        {
            var correctedPhoneNumber = "+" + phoneNumber;
            return await _context.Contacts
                    .AnyAsync(p => p.PhoneNumber == correctedPhoneNumber
                    && p.OptOutTime == DateTime.MinValue
                    && p.IsActive);
        }

        private async Task<bool> HasMessageBeenSentBefore(int messageTypeID, int responseID)
        {
            return await _context.Messages
                            .Where(m => m.SurveyResponseId == responseID && messageTypeID == m.MessageTypeID)
                            .AnyAsync();
        }

        public async Task SendMessageAsync(Models.Message message)
        {
            try
            {
                //Make sure that Sms is currently enabled to send
                if (await _context.SmsStatuses.AnyAsync(s => s.IsSmsActive == false))
                {
                    throw new InvalidOperationException("SMS functionality is currently disabled.");
                }

                if (await HasMessageBeenSentBefore(messageTypeID: message.MessageTypeID ?? 0, message.SurveyResponseId ?? 0))
                {
                    throw new InvalidOperationException("SMS has already been sent out for this survey and message type.");
                }
                
                // Ensure sender number is in E.164 format
                var fromNumber = _fromNumber;
                if (!fromNumber.StartsWith("+"))
                {
                    fromNumber = "+" + fromNumber;
                }

                _logger.LogDebug($"Sender number: {fromNumber}");

                var request = new SendSmsRequest
                {
                    To = message.PhoneNumber,
                    From = fromNumber,
                    Text = message.Content,
                    Type = SmsType.Text,
                    StatusReportReq = true,
                    // Add 10DLC specific parameters
                    Ttl = 3600000, // 1 hour TTL
                    ClientRef = $"campaign_{DateTime.UtcNow:yyyyMMdd}" // Add campaign reference
                };

                _logger.LogDebug($"Request details: From={request.From}, To={request.To}, Type={request.Type}, ClientRef={request.ClientRef}");

                var response = await _VonageClient.SmsClient.SendAnSmsAsync(request);

                _logger.LogDebug($"=== Vonage API Response ===");
                _logger.LogDebug($"Status: {response.Messages[0].Status}");
                _logger.LogDebug($"MessageId: {response.Messages[0].MessageId}");
                _logger.LogDebug($"ErrorText: {response.Messages[0].ErrorText}");
                _logger.LogDebug($"RemainingBalance: {response.Messages[0].RemainingBalance}");
                _logger.LogDebug($"MessagePrice: {response.Messages[0].MessagePrice}");
                _logger.LogDebug($"Network: {response.Messages[0].Network}");

                if (response.Messages[0].Status != "0")
                {
                    var errorMessage = $"Failed to send message. Status: {response.Messages[0].Status}, " +
                                     $"Error: {response.Messages[0].ErrorText}, " +
                                     $"MessageId: {response.Messages[0].MessageId}, " +
                                     $"Network: {response.Messages[0].Network}";
                    _logger.LogError(errorMessage);
                    throw new Exception(errorMessage);
                }
                //Add the Vonage Message ID to the message record
                message.VonageMessageID = response.Messages[0].MessageId;

                await _context.AddAsync(message);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Message sent successfully to {message.PhoneNumber}. " +
                                     $"MessageId: {response.Messages[0].MessageId}, " +
                                     $"Network: {response.Messages[0].Network}, " +
                                     $"RemainingBalance: {response.Messages[0].RemainingBalance}");

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error sending message to {message.PhoneNumber}. Stack trace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    _logger.LogError($"Inner exception: {ex.InnerException.Message}");
                }
                throw;
            }
        }
    }
}
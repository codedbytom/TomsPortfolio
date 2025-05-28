namespace server.Models
{
    public class Message
    {
        public int Id { get; set; }
        public string PhoneNumber { get; set; } = "";
        public string Content { get; set; } = "";
        public int? ContactId { get; set; }
        public string? Url { get; set; }
        public int? SurveyResponseId { get; set; }
        public SurveyResponse? SurveyResponse { get; set; }
        public int? MessageTypeID { get; set; }
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
        public string? VonageMessageID {get; set;}
        public Contact? Contact { get; set; }
        public DateTime? DeliveredAt { get; set; }
        public MessageType? MessageType {get; set;}
        public string? ErrorMessage { get; set; }

    }
    public enum MessageStatus
    {
        submitted,
        rejected,
        Delivered,
        undeliverable
    }
}

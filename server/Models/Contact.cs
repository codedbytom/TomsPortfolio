namespace server.Models
{
    public class Contact
    {
        public int Id { get; set; }
        public required string Name { get; set; } = "";
        public required string PhoneNumber { get; set; } = "";
        public DateTime OptInTime { get; set; } = DateTime.UtcNow;
        public DateTime OptOutTime { get; set; } = DateTime.MinValue;
        public DateTime LastActiveTime { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;

        public List<SurveyResponse> Surveys { get; set; } = new();
        public List<Message> Messages { get; set; } = new();
    }
}

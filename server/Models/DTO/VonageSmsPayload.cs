using System.Text.Json.Serialization;

namespace server.Models.DTO
{
    public class VonageSmsPayload
{
    [JsonPropertyName("msisdn")]
    public required string Msisdn { get; set; }

    [JsonPropertyName("to")]
    public required string To { get; set; }

    [JsonPropertyName("messageId")]
    public required string MessageId { get; set; }

    [JsonPropertyName("text")]
    public required string Text { get; set; }

    [JsonPropertyName("type")]
    public required string Type { get; set; }

    [JsonPropertyName("keyword")]
    public required string Keyword { get; set; }

    [JsonPropertyName("api-key")]
    public required string ApiKey { get; set; } // maps to "api-key"

    [JsonPropertyName("message-timestamp")]
    public required string MessageTimestamp { get; set; } // has hyphen
}
}

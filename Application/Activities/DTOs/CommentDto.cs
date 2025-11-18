using System;
using System.Text.Json.Serialization;

namespace Application.Activities.DTOs;

public class CommentDto
{
    public required string Id { get; set; } 
    public required string Body { get; set; }
    [JsonPropertyName("createdAt")]
    public DateTime CreatedaAt { get; set; } = DateTime.UtcNow;
    public required string UserId { get; set; }
    public required string DisplayName { get; set; }
    public string? ImageUrl { get; set; }
}

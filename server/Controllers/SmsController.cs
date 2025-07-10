using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.data;
using server.Models;
using Vonage.Users;
using server.Services;

namespace server.Controllers{
    [ApiController]
    [Route("api/[controller]")]
    public class SmsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMessagingService _messagingService;
        public SmsController(AppDbContext context, IMessagingService messagingService)
        {
            _context = context;
            _messagingService = messagingService;
        }

        [HttpGet("status")]
        public async Task<IActionResult> GetSmsStatus()
        {
            var settings = await _context.SmsStatuses.FirstOrDefaultAsync();
            // Assume IsSmsKilled is true if SMS is OFF
            bool isSmsActive = settings != null && settings.IsSmsActive;
            return Ok(new { isSmsActive });
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="body"></param>
        /// <returns></returns>
        [HttpPost("webhooks/inbound-sms")]
        public async Task<IActionResult> Unsubscribe([FromBody] Models.DTO.VonageSmsPayload body)
        {
            await _messagingService.HandleInbound(body);
            return NoContent();
        }
    }
}
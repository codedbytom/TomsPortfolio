using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.data;
using server.Services;

namespace server.Controllers{
    [ApiController]
    [Route("api/[controller]")]
    public class SmsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMessagingService _messagingService;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private readonly ILogger<SmsController> _logger;
        public SmsController(AppDbContext context, IMessagingService messagingService, IServiceScopeFactory serviceScopeFactory, ILogger<SmsController> logger)
        {
            _context = context;
            _messagingService = messagingService;
            _serviceScopeFactory = serviceScopeFactory;
            _logger = logger;
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
            _ = Task.Run(async () => {
                try
                {
                    using var scope = _serviceScopeFactory.CreateScope();
                    var svc = scope.ServiceProvider.GetRequiredService<IMessagingService>();
                    await svc.HandleInbound(body); 
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error was found in Unsubscribe:");
                }
            });
            return Ok();
        }
    }
}
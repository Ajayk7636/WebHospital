using HealthcareApi.Data;
using HealthcareApi.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HealthcareApi.Controllers
{
    [Route("api/v1/dashboard")]
    [ApiController]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly HealthcareContext _context;

        public DashboardController(HealthcareContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAdminStats()
        {
            var stats = new DashboardStatsDto
            {
                TotalDoctors = await _context.Doctors.CountAsync(),
                TotalPatients = await _context.Patients.CountAsync(),
                TotalAppointments = await _context.Appointments.CountAsync(),
                AppointmentsToday = await _context.Appointments.CountAsync(a => a.AppDate.Date == DateTime.Today)
            };
            return Ok(stats);
        }
    }
}

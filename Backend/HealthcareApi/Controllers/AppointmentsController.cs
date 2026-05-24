using HealthcareApi.Data;
using HealthcareApi.DTOs;
using HealthcareApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HealthcareApi.Controllers
{
    [Route("api/v1/appointments")]
    [ApiController]
    [Authorize]
    public class AppointmentsController : ControllerBase
    {
        private readonly HealthcareContext _context;

        public AppointmentsController(HealthcareContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> BookAppointment(AppointmentCreateDto dto)
        {
            var appointment = new Appointment
            {
                PatientId = dto.PatientId,
                DoctorId = dto.DoctorId,
                AppDate = DateTime.Parse(dto.AppDate),
                AppTime = TimeSpan.Parse(dto.AppTime),
                Status = "Pending",
                Reason = dto.Reason
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();
            return Ok(new { id = appointment.Id, status = appointment.Status });
        }

        [HttpGet]
        public async Task<IActionResult> GetAppointments(int? userId, string? role)
        {
            var query = _context.Appointments
                .Include(a => a.Patient!.User)
                .Include(a => a.Doctor!.User)
                .AsQueryable();

            if (role == "Patient" && userId.HasValue)
                query = query.Where(a => a.Patient!.UserId == userId.Value);
            else if (role == "Doctor" && userId.HasValue)
                query = query.Where(a => a.Doctor!.UserId == userId.Value);

            var result = await query.Select(a => new {
                a.Id,
                a.AppDate,
                a.AppTime,
                a.Status,
                a.Reason,
                PatientName = a.Patient!.User!.FirstName + " " + a.Patient.User.LastName,
                DoctorName = a.Doctor!.User!.FirstName + " " + a.Doctor.User.LastName
            }).ToListAsync();

            return Ok(result);
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
        {
            var appt = await _context.Appointments.FindAsync(id);
            if (appt == null) return NotFound();

            appt.Status = status;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Status updated" });
        }
    }
}

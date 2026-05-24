using HealthcareApi.Data;
using HealthcareApi.DTOs;
using HealthcareApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

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
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var role = User.FindFirstValue(ClaimTypes.Role);

            int finalPatientId = dto.PatientId;

            // Security: If user is a patient, ignore the PatientId in DTO and use their actual linked PatientId
            if (role == "Patient")
            {
                var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == userId);
                if (patient == null) return Forbid();
                finalPatientId = patient.Id;
            }

            var appointment = new Appointment
            {
                PatientId = finalPatientId,
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
        public async Task<IActionResult> GetAppointments()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var role = User.FindFirstValue(ClaimTypes.Role);

            var query = _context.Appointments
                .Include(a => a.Patient!.User)
                .Include(a => a.Doctor!.User)
                .AsQueryable();

            if (role == "Patient")
            {
                var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == userId);
                if (patient == null) return Ok(new List<object>());
                query = query.Where(a => a.PatientId == patient.Id);
            }
            else if (role == "Doctor")
            {
                var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.UserId == userId);
                if (doctor == null) return Ok(new List<object>());
                query = query.Where(a => a.DoctorId == doctor.Id);
            }

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

using HealthcareApi.Data;
using HealthcareApi.DTOs;
using HealthcareApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace HealthcareApi.Controllers
{
    [Route("api/v1/prescriptions")]
    [ApiController]
    [Authorize]
    public class PrescriptionsController : ControllerBase
    {
        private readonly HealthcareContext _context;

        public PrescriptionsController(HealthcareContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> AddPrescription(PrescriptionCreateDto dto)
        {
            var prescription = new Prescription
            {
                AppointmentId = dto.AppointmentId,
                Diagnosis = dto.Diagnosis,
                Medicines = dto.Medicines,
                Instructions = dto.Instructions
            };

            _context.Prescriptions.Add(prescription);

            var appointment = await _context.Appointments.FindAsync(dto.AppointmentId);
            if (appointment != null)
            {
                appointment.Status = "Completed";
            }

            await _context.SaveChangesAsync();
            return Ok(new { id = prescription.Id, message = "Prescription added" });
        }

        [HttpGet("appointment/{id}")]
        public async Task<IActionResult> GetByAppointment(int id)
        {
            var p = await _context.Prescriptions
                .FirstOrDefaultAsync(x => x.AppointmentId == id);

            if (p == null) return NotFound();
            return Ok(p);
        }

        [HttpGet("patient/history")]
        public async Task<IActionResult> GetPatientHistory()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var role = User.FindFirstValue(ClaimTypes.Role);

            if (role != "Patient") return Forbid();

            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == userId);
            if (patient == null) return NotFound();

            var history = await _context.Prescriptions
                .Include(p => p.Appointment)
                .ThenInclude(a => a!.Doctor!.User)
                .Where(p => p.Appointment!.PatientId == patient.Id)
                .Select(p => new {
                    p.Id,
                    p.CreatedAt,
                    p.Diagnosis,
                    p.Medicines,
                    p.Instructions,
                    DoctorName = p.Appointment!.Doctor!.User!.FirstName + " " + p.Appointment.Doctor.User.LastName
                })
                .ToListAsync();

            return Ok(history);
        }
    }
}

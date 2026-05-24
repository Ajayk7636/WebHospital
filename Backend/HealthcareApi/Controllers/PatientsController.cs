using HealthcareApi.Data;
using HealthcareApi.DTOs;
using HealthcareApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace HealthcareApi.Controllers
{
    [Route("api/v1/patients")]
    [ApiController]
    [Authorize]
    public class PatientsController : ControllerBase
    {
        private readonly HealthcareContext _context;

        public PatientsController(HealthcareContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetPatients()
        {
            var patients = await _context.Patients
                .Include(p => p.User)
                .Select(p => new {
                    p.Id,
                    FullName = p.User!.FirstName + " " + p.User.LastName,
                    p.User.Email,
                    p.User.Phone,
                    p.DateOfBirth,
                    p.Gender
                }).ToListAsync();
            return Ok(patients);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPatient(int id)
        {
            var patient = await _context.Patients
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (patient == null) return NotFound();
            return Ok(patient);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddPatient(PatientCreateDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest("Email already exists.");

            var user = new User
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                RoleId = 3, // Patient
                Phone = dto.Phone
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var patient = new Patient
            {
                UserId = user.Id,
                DateOfBirth = DateTime.Parse(dto.DateOfBirth),
                Gender = dto.Gender,
                Address = dto.Address
            };

            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();

            return Ok(new { id = patient.Id, message = "Patient added successfully" });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePatient(int id, PatientUpdateDto dto)
        {
            var patient = await _context.Patients.Include(p => p.User).FirstOrDefaultAsync(p => p.Id == id);
            if (patient == null) return NotFound();

            // Authorization check: Admin or the Patient themselves
            var userId = int.Parse(User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier)!);
            var role = User.FindFirstValue(System.Security.Claims.ClaimTypes.Role);
            if (role != "Admin" && patient.UserId != userId) return Forbid();

            patient.DateOfBirth = DateTime.Parse(dto.DateOfBirth);
            patient.Gender = dto.Gender;
            patient.Address = dto.Address;

            if (patient.User != null)
            {
                patient.User.FirstName = dto.FirstName;
                patient.User.LastName = dto.LastName;
                patient.User.Phone = dto.Phone;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Patient updated successfully" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            var patient = await _context.Patients.Include(p => p.User).FirstOrDefaultAsync(p => p.Id == id);
            if (patient == null) return NotFound();

            if (patient.User != null)
            {
                _context.Users.Remove(patient.User);
            }
            _context.Patients.Remove(patient);

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}

using HealthcareApi.Data;
using HealthcareApi.DTOs;
using HealthcareApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HealthcareApi.Controllers
{
    [Route("api/v1/doctors")]
    [ApiController]
    [Authorize]
    public class DoctorsController : ControllerBase
    {
        private readonly HealthcareContext _context;

        public DoctorsController(HealthcareContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetDoctors()
        {
            var doctors = await _context.Doctors
                .Include(d => d.User)
                .Include(d => d.Department)
                .Select(d => new {
                    d.Id,
                    FullName = d.User!.FirstName + " " + d.User.LastName,
                    d.Specialization,
                    Department = d.Department!.DeptName,
                    d.Experience,
                    d.Qualification
                }).ToListAsync();
            return Ok(doctors);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddDoctor(DoctorCreateDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest("Email already exists.");

            var user = new User
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                RoleId = 2 // Doctor
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var doctor = new Doctor
            {
                UserId = user.Id,
                DeptId = dto.DeptId,
                Specialization = dto.Specialization,
                Qualification = dto.Qualification,
                Experience = dto.Experience
            };

            _context.Doctors.Add(doctor);
            await _context.SaveChangesAsync();

            return Ok(new { id = doctor.Id, message = "Doctor added successfully" });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateDoctor(int id, DoctorUpdateDto dto)
        {
            var doctor = await _context.Doctors.Include(d => d.User).FirstOrDefaultAsync(d => d.Id == id);
            if (doctor == null) return NotFound();

            doctor.Specialization = dto.Specialization;
            doctor.Qualification = dto.Qualification;
            doctor.Experience = dto.Experience;
            doctor.DeptId = dto.DeptId;

            if (doctor.User != null)
            {
                doctor.User.FirstName = dto.FirstName;
                doctor.User.LastName = dto.LastName;
                doctor.User.Phone = dto.Phone;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Doctor updated successfully" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteDoctor(int id)
        {
            var doctor = await _context.Doctors.Include(d => d.User).FirstOrDefaultAsync(d => d.Id == id);
            if (doctor == null) return NotFound();

            if (doctor.User != null)
            {
                _context.Users.Remove(doctor.User);
            }
            _context.Doctors.Remove(doctor);

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}

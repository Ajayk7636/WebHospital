using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthcareApi.Models
{
    public class Role
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [StringLength(20)]
        public string RoleName { get; set; } = string.Empty;
    }

    public class User
    {
        [Key]
        public int Id { get; set; }
        public int RoleId { get; set; }
        [ForeignKey("RoleId")]
        public Role? Role { get; set; }

        [Required]
        [StringLength(50)]
        public string FirstName { get; set; } = string.Empty;
        [Required]
        [StringLength(50)]
        public string LastName { get; set; } = string.Empty;
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        [StringLength(15)]
        public string? Phone { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class Department
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [StringLength(50)]
        public string DeptName { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    public class Doctor
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public User? User { get; set; }

        public int DeptId { get; set; }
        [ForeignKey("DeptId")]
        public Department? Department { get; set; }

        [Required]
        public string Specialization { get; set; } = string.Empty;
        public string? Qualification { get; set; }
        public int Experience { get; set; }
    }

    public class Patient
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public User? User { get; set; }

        public DateTime? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? Address { get; set; }
    }

    public class Appointment
    {
        [Key]
        public int Id { get; set; }
        public int PatientId { get; set; }
        [ForeignKey("PatientId")]
        public Patient? Patient { get; set; }

        public int DoctorId { get; set; }
        [ForeignKey("DoctorId")]
        public Doctor? Doctor { get; set; }

        public DateTime AppDate { get; set; }
        public TimeSpan AppTime { get; set; }
        public string Status { get; set; } = "Pending"; // Pending, Confirmed, Completed, Cancelled
        public string? Reason { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class Prescription
    {
        [Key]
        public int Id { get; set; }
        public int AppointmentId { get; set; }
        [ForeignKey("AppointmentId")]
        public Appointment? Appointment { get; set; }

        [Required]
        public string Diagnosis { get; set; } = string.Empty;
        public string? Medicines { get; set; }
        public string? Instructions { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

namespace HealthcareApi.DTOs
{
    public class AppointmentCreateDto
    {
        public int PatientId { get; set; }
        public int DoctorId { get; set; }
        public string AppDate { get; set; } = string.Empty; // YYYY-MM-DD
        public string AppTime { get; set; } = string.Empty; // HH:mm:ss
        public string? Reason { get; set; }
    }

    public class PrescriptionCreateDto
    {
        public int AppointmentId { get; set; }
        public string Diagnosis { get; set; } = string.Empty;
        public string? Medicines { get; set; }
        public string? Instructions { get; set; }
    }

    public class DashboardStatsDto
    {
        public int TotalDoctors { get; set; }
        public int TotalPatients { get; set; }
        public int TotalAppointments { get; set; }
        public int AppointmentsToday { get; set; }
    }
}

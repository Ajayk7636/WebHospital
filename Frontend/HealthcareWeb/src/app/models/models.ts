export interface User {
    id: number;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
}

export interface AuthResponse {
    token: string;
    role: string;
    userId: number;
}

export interface Doctor {
    id: number;
    fullName: string;
    specialization: string;
    department: string;
    experience: number;
}

export interface Appointment {
    id: number;
    appDate: string;
    appTime: string;
    status: string;
    reason?: string;
    patientName?: string;
    doctorName?: string;
}

export interface Prescription {
    id: number;
    createdAt: string;
    diagnosis: string;
    medicines: string;
    instructions: string;
    doctorName: string;
}

export interface DashboardStats {
    totalDoctors: number;
    totalPatients: number;
    totalAppointments: number;
    appointmentsToday: number;
}

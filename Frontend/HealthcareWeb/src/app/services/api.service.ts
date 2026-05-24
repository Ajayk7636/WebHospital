import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse, Doctor, Appointment, Prescription, DashboardStats } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:5000/api/v1';

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}/doctors`, this.getHeaders());
  }

  addDoctor(doctor: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/doctors`, doctor, this.getHeaders());
  }

  updateDoctor(id: number, doctor: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/doctors/${id}`, doctor, this.getHeaders());
  }

  deleteDoctor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/doctors/${id}`, this.getHeaders());
  }

  getPatients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/patients`, this.getHeaders());
  }

  addPatient(patient: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/patients`, patient, this.getHeaders());
  }

  updatePatient(id: number, patient: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/patients/${id}`, patient, this.getHeaders());
  }

  deletePatient(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/patients/${id}`, this.getHeaders());
  }

  bookAppointment(appointment: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/appointments`, appointment, this.getHeaders());
  }

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/appointments`, this.getHeaders());
  }

  updateAppointmentStatus(id: number, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/appointments/${id}/status`, `"${status}"`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      })
    });
  }

  cancelAppointment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/appointments/${id}`, this.getHeaders());
  }

  addPrescription(prescription: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/prescriptions`, prescription, this.getHeaders());
  }

  getPatientHistory(): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(`${this.apiUrl}/prescriptions/patient/history`, this.getHeaders());
  }

  getAdminStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard/stats`, this.getHeaders());
  }
}

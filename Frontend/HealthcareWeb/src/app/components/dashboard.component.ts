import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Doctor, Appointment, Prescription, DashboardStats } from '../models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="font-family: Arial, sans-serif;">
      <h2>{{role}} Dashboard</h2>
      <hr>

      <!-- Admin View -->
      <div *ngIf="role === 'Admin'">
        <h3>System Overview</h3>
        <div style="display: flex; gap: 1rem; margin-bottom: 2rem;">
          <div class="stat-card">Doctors: {{stats?.totalDoctors}}</div>
          <div class="stat-card">Patients: {{stats?.totalPatients}}</div>
          <div class="stat-card">Total Appts: {{stats?.totalAppointments}}</div>
          <div class="stat-card">Today: {{stats?.appointmentsToday}}</div>
        </div>
      </div>

      <!-- Patient View -->
      <div *ngIf="role === 'Patient'">
        <h3>Book an Appointment</h3>
        <div style="margin-bottom: 2rem; border: 1px solid #ddd; padding: 1rem;">
          <select [(ngModel)]="selectedDoctorId" style="padding: 0.5rem; margin-right: 1rem;">
            <option [value]="null">Select Doctor</option>
            <option *ngFor="let d of doctors" [value]="d.id">{{d.fullName}} ({{d.specialization}})</option>
          </select>
          <input type="date" [(ngModel)]="apptDate" style="padding: 0.5rem; margin-right: 1rem;">
          <button (click)="onBook()" [disabled]="!selectedDoctorId" style="padding: 0.5rem 1rem; background: #28a745; color: white; border: none; cursor: pointer;">Book Now</button>
        </div>

        <h3>My Medical History</h3>
        <div *ngFor="let p of history" style="border-bottom: 1px solid #eee; padding: 0.5rem 0;">
          <b>{{p.createdAt | date}}</b> - Dr. {{p.doctorName}}<br>
          <i>Diagnosis: {{p.diagnosis}}</i><br>
          <small>Med: {{p.medicines}} | Instructions: {{p.instructions}}</small>
        </div>
      </div>

      <!-- Shared Appointments View -->
      <div style="margin-top: 2rem;">
        <h3>Appointments Schedule</h3>
        <table border="1" style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="background: #f4f4f4;">
              <th>Date</th>
              <th>Time</th>
              <th *ngIf="role !== 'Patient'">Patient</th>
              <th *ngIf="role === 'Patient'">Doctor</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let a of appointments">
              <td>{{a.appDate | date}}</td>
              <td>{{a.appTime}}</td>
              <td *ngIf="role !== 'Patient'">{{a.patientName}}</td>
              <td *ngIf="role === 'Patient'">{{a.doctorName}}</td>
              <td><span [style.color]="a.status === 'Completed' ? 'green' : 'orange'">{{a.status}}</span></td>
              <td>
                <button *ngIf="role === 'Doctor' && a.status === 'Pending'" (click)="updateStatus(a.id, 'Confirmed')">Confirm</button>
                <button *ngIf="role === 'Doctor' && a.status === 'Confirmed'" (click)="openPrescriptionForm(a.id)">Add Prescription</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Prescription Modal (Simulated) -->
      <div *ngIf="showPrescriptionForm" class="modal">
        <div class="modal-content">
          <h3>Issue Prescription</h3>
          <textarea [(ngModel)]="newPrescription.diagnosis" placeholder="Diagnosis" style="width: 100%; height: 60px; margin-bottom: 0.5rem;"></textarea>
          <textarea [(ngModel)]="newPrescription.medicines" placeholder="Medicines" style="width: 100%; height: 60px; margin-bottom: 0.5rem;"></textarea>
          <textarea [(ngModel)]="newPrescription.instructions" placeholder="Instructions" style="width: 100%; height: 40px; margin-bottom: 1rem;"></textarea>
          <button (click)="submitPrescription()" style="background: #007bff; color: white; border: none; padding: 0.5rem 1rem;">Save</button>
          <button (click)="showPrescriptionForm = false" style="margin-left: 0.5rem;">Cancel</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stat-card { background: #f8f9fa; padding: 1.5rem; border: 1px solid #dee2e6; border-radius: 4px; flex: 1; text-align: center; font-weight: bold; }
    .modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; }
    .modal-content { background: white; padding: 2rem; border-radius: 8px; width: 400px; }
    th, td { padding: 0.75rem; }
  `]
})
export class DashboardComponent implements OnInit {
  role: string | null = '';
  userId: number = 0;

  doctors: Doctor[] = [];
  appointments: Appointment[] = [];
  history: Prescription[] = [];
  stats?: DashboardStats;

  // Booking Form
  selectedDoctorId: number | null = null;
  apptDate: string = '';

  // Prescription Form
  showPrescriptionForm = false;
  activeApptId = 0;
  newPrescription = { diagnosis: '', medicines: '', instructions: '' };

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.role = localStorage.getItem('role');
    this.userId = Number(localStorage.getItem('userId'));

    this.loadAppointments();

    if (this.role === 'Admin') {
      this.apiService.getAdminStats().subscribe(data => this.stats = data);
    } else if (this.role === 'Patient') {
      this.apiService.getDoctors().subscribe(data => this.doctors = data);
      this.apiService.getPatientHistory(this.userId).subscribe(data => this.history = data);
    }
  }

  loadAppointments() {
    this.apiService.getAppointments(this.userId, this.role!).subscribe(data => this.appointments = data);
  }

  onBook() {
    if (!this.selectedDoctorId || !this.apptDate) return;
    const body = {
      patientId: this.userId,
      doctorId: Number(this.selectedDoctorId),
      appDate: this.apptDate,
      appTime: "10:00:00"
    };
    this.apiService.bookAppointment(body).subscribe(() => {
      alert('Appointment booked successfully!');
      this.loadAppointments();
    });
  }

  updateStatus(id: number, status: string) {
    this.apiService.updateAppointmentStatus(id, status).subscribe(() => this.loadAppointments());
  }

  openPrescriptionForm(apptId: number) {
    this.activeApptId = apptId;
    this.showPrescriptionForm = true;
  }

  submitPrescription() {
    const body = {
      appointmentId: this.activeApptId,
      ...this.newPrescription
    };
    this.apiService.addPrescription(body).subscribe(() => {
      alert('Prescription saved!');
      this.showPrescriptionForm = false;
      this.loadAppointments();
    });
  }
}

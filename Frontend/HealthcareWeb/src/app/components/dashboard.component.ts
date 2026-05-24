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
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h2>{{role}} Dashboard</h2>
        <div style="display: flex; gap: 10px;">
          <button *ngIf="role === 'Admin'" (click)="view = 'Stats'" [style.background]="view === 'Stats' ? '#ddd' : ''">Stats</button>
          <button *ngIf="role === 'Admin'" (click)="view = 'Doctors'" [style.background]="view === 'Doctors' ? '#ddd' : ''">Doctors</button>
          <button *ngIf="role === 'Admin'" (click)="view = 'Patients'" [style.background]="view === 'Patients' ? '#ddd' : ''">Patients</button>
          <button *ngIf="role === 'Admin'" (click)="view = 'Appointments'" [style.background]="view === 'Appointments' ? '#ddd' : ''">Appointments</button>
        </div>
      </div>
      <hr>

      <!-- Admin View: Stats -->
      <div *ngIf="role === 'Admin' && view === 'Stats'">
        <h3>System Overview</h3>
        <div style="display: flex; gap: 1rem; margin-bottom: 2rem;">
          <div class="stat-card">Doctors: {{stats?.totalDoctors}}</div>
          <div class="stat-card">Patients: {{stats?.totalPatients}}</div>
          <div class="stat-card">Total Appts: {{stats?.totalAppointments}}</div>
          <div class="stat-card">Today: {{stats?.appointmentsToday}}</div>
        </div>
      </div>

      <!-- Admin View: Doctors -->
      <div *ngIf="role === 'Admin' && view === 'Doctors'">
        <div style="display: flex; justify-content: space-between;">
          <h3>Manage Doctors</h3>
          <button (click)="showDoctorModal = true" style="background: #007bff; color: white;">+ Add Doctor</button>
        </div>
        <table border="1" style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead><tr><th>Name</th><th>Specialty</th><th>Dept</th><th>Exp</th></tr></thead>
          <tbody>
            <tr *ngFor="let d of doctors">
              <td>{{d.fullName}}</td>
              <td>{{d.specialization}}</td>
              <td>{{d.department}}</td>
              <td>{{d.experience}} Yrs</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Admin View: Patients -->
      <div *ngIf="role === 'Admin' && view === 'Patients'">
        <h3>Manage Patients</h3>
        <table border="1" style="width: 100%; border-collapse: collapse;">
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Gender</th></tr></thead>
          <tbody>
            <tr *ngFor="let p of allPatients">
              <td>{{p.fullName}}</td>
              <td>{{p.email}}</td>
              <td>{{p.phone}}</td>
              <td>{{p.gender}}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Patient View: Booking -->
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

      <!-- Appointments List (Shared) -->
      <div *ngIf="view === 'Appointments' || role !== 'Admin'">
        <div style="display:flex; justify-content:space-between">
          <h3>Appointments Schedule</h3>
          <button (click)="loadAppointments()">Refresh</button>
        </div>
        <table border="1" style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="background: #f4f4f4;">
              <th>Date</th>
              <th>Time</th>
              <th *ngIf="role !== 'Patient'">Patient</th>
              <th *ngIf="role === 'Patient'">Doctor</th>
              <th *ngIf="role === 'Admin'">Doctor</th>
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
              <td *ngIf="role === 'Admin'">{{a.doctorName}}</td>
              <td><span [style.color]="a.status === 'Completed' ? 'green' : 'orange'">{{a.status}}</span></td>
              <td>
                <button *ngIf="role === 'Doctor' && a.status === 'Pending'" (click)="updateStatus(a.id, 'Confirmed')">Confirm</button>
                <button *ngIf="role === 'Doctor' && a.status === 'Confirmed'" (click)="openPrescriptionForm(a.id)">Add Prescription</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Add Doctor Modal -->
      <div *ngIf="showDoctorModal" class="modal">
        <div class="modal-content">
          <h3>Add New Doctor</h3>
          <input type="text" [(ngModel)]="newDoctor.firstName" placeholder="First Name" style="width:100%; margin-bottom:5px">
          <input type="text" [(ngModel)]="newDoctor.lastName" placeholder="Last Name" style="width:100%; margin-bottom:5px">
          <input type="email" [(ngModel)]="newDoctor.email" placeholder="Email" style="width:100%; margin-bottom:5px">
          <input type="password" [(ngModel)]="newDoctor.password" placeholder="Password" style="width:100%; margin-bottom:5px">
          <input type="text" [(ngModel)]="newDoctor.specialization" placeholder="Specialization" style="width:100%; margin-bottom:5px">
          <select [(ngModel)]="newDoctor.deptId" style="width:100%; margin-bottom:5px">
            <option [value]="1">Cardiology</option>
            <option [value]="2">Pediatrics</option>
            <option [value]="3">General Medicine</option>
          </select>
          <button (click)="submitDoctor()" style="background:#007bff; color:white">Save</button>
          <button (click)="showDoctorModal = false">Cancel</button>
        </div>
      </div>

      <!-- Prescription Modal -->
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
    .modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-content { background: white; padding: 2rem; border-radius: 8px; width: 400px; }
    th, td { padding: 0.75rem; }
  `]
})
export class DashboardComponent implements OnInit {
  role: string | null = '';
  userId: number = 0;
  view: string = 'Stats';

  doctors: Doctor[] = [];
  allPatients: any[] = [];
  appointments: Appointment[] = [];
  history: Prescription[] = [];
  stats?: DashboardStats;

  selectedDoctorId: number | null = null;
  apptDate: string = '';

  showDoctorModal = false;
  newDoctor = { firstName: '', lastName: '', email: '', password: '', specialization: '', deptId: 3, experience: 5 };

  showPrescriptionForm = false;
  activeApptId = 0;
  newPrescription = { diagnosis: '', medicines: '', instructions: '' };

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.role = localStorage.getItem('role');
    this.userId = Number(localStorage.getItem('userId'));

    if (this.role === 'Admin') {
      this.view = 'Stats';
      this.apiService.getAdminStats().subscribe(data => this.stats = data);
      this.apiService.getDoctors().subscribe(data => this.doctors = data);
      this.apiService.getPatients().subscribe(data => this.allPatients = data);
    } else if (this.role === 'Patient') {
      this.apiService.getDoctors().subscribe(data => this.doctors = data);
      this.apiService.getPatientHistory().subscribe(data => this.history = data);
    }

    this.loadAppointments();
  }

  loadAppointments() {
    this.apiService.getAppointments().subscribe(data => this.appointments = data);
  }

  onBook() {
    if (!this.selectedDoctorId || !this.apptDate) return;
    const body = {
      patientId: 0, // Backend will use authenticated user's PatientId
      doctorId: Number(this.selectedDoctorId),
      appDate: this.apptDate,
      appTime: "10:00:00"
    };
    this.apiService.bookAppointment(body).subscribe(() => {
      alert('Appointment booked successfully!');
      this.loadAppointments();
    });
  }

  submitDoctor() {
    this.apiService.addDoctor(this.newDoctor).subscribe({
      next: () => {
        alert('Doctor added!');
        this.showDoctorModal = false;
        this.ngOnInit();
      },
      error: () => alert('Failed to add doctor')
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

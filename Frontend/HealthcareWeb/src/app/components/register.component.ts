import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="max-width: 500px; margin: auto; border: 1px solid #ccc; padding: 2rem; border-radius: 8px;">
      <h2>Register</h2>
      <form (submit)="onRegister()">
        <input type="text" [(ngModel)]="user.firstName" name="fn" placeholder="First Name" required style="width: 100%; margin-bottom: 1rem; padding: 0.5rem;">
        <input type="text" [(ngModel)]="user.lastName" name="ln" placeholder="Last Name" required style="width: 100%; margin-bottom: 1rem; padding: 0.5rem;">
        <input type="email" [(ngModel)]="user.email" name="email" placeholder="Email" required style="width: 100%; margin-bottom: 1rem; padding: 0.5rem;">
        <input type="password" [(ngModel)]="user.password" name="pwd" placeholder="Password" required style="width: 100%; margin-bottom: 1rem; padding: 0.5rem;">
        <button type="submit" style="width: 100%; padding: 0.75rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Register</button>
      </form>
    </div>
  `
})
export class RegisterComponent {
  user = { firstName: '', lastName: '', email: '', password: '' };
  constructor(private apiService: ApiService) {}
  onRegister() {
    this.apiService.register(this.user).subscribe({
      next: () => alert('Registration successful! Please login.'),
      error: () => alert('Registration failed')
    });
  }
}

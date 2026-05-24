import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="max-width: 400px; margin: auto; border: 1px solid #ccc; padding: 2rem; border-radius: 8px;">
      <h2>Login</h2>
      <form (submit)="onLogin()">
        <div style="margin-bottom: 1rem;">
          <label>Email</label><br>
          <input type="email" [(ngModel)]="email" name="email" required style="width: 100%; padding: 0.5rem;">
        </div>
        <div style="margin-bottom: 1rem;">
          <label>Password</label><br>
          <input type="password" [(ngModel)]="password" name="password" required style="width: 100%; padding: 0.5rem;">
        </div>
        <button type="submit" style="width: 100%; padding: 0.75rem; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Login
        </button>
      </form>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private apiService: ApiService, private router: Router) {}

  onLogin() {
    this.apiService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        localStorage.setItem('userId', res.userId.toString());
        this.router.navigate(['/dashboard']);
      },
      error: (err) => alert('Login failed')
    });
  }
}

import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav style="background: #007bff; padding: 1rem; color: white;">
      <h1 style="margin: 0; display: inline-block;">Healthcare HMS</h1>
      <div style="float: right;">
        <a routerLink="/login" style="color: white; margin-left: 1rem;">Login</a>
        <a routerLink="/register" style="color: white; margin-left: 1rem;">Register</a>
      </div>
    </nav>
    <div style="padding: 2rem;">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent { }

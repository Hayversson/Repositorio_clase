import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="card">
          <div class="card-header text-center">
            <h2 class="card-title">Iniciar Sesión</h2>
          </div>
          
          <div class="card-body">
            <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
              <div class="form-group">
                <label for="email" class="form-label">Email</label>
                <input 
                  type="email" 
                  id="email"
                  class="form-control" 
                  [(ngModel)]="loginData.email"
                  name="email"
                  required
                  email
                  #email="ngModel"
                  [class.is-invalid]="email.invalid && email.touched"
                >
                <div class="invalid-feedback" *ngIf="email.invalid && email.touched">
                  <div *ngIf="email.errors?.['required']">El email es requerido</div>
                  <div *ngIf="email.errors?.['email']">El email no es válido</div>
                </div>
              </div>

              <div class="form-group">
                <label for="password" class="form-label">Contraseña</label>
                <input 
                  type="password" 
                  id="password"
                  class="form-control" 
                  [(ngModel)]="loginData.password"
                  name="password"
                  required
                  minlength="6"
                  #password="ngModel"
                  [class.is-invalid]="password.invalid && password.touched"
                >
                <div class="invalid-feedback" *ngIf="password.invalid && password.touched">
                  <div *ngIf="password.errors?.['required']">La contraseña es requerida</div>
                  <div *ngIf="password.errors?.['minlength']">La contraseña debe tener al menos 6 caracteres</div>
                </div>
              </div>

              <div class="form-group">
                <button 
                  type="submit" 
                  class="btn btn-primary w-100"
                  [disabled]="loginForm.invalid || loading"
                >
                  <span *ngIf="loading">Iniciando sesión...</span>
                  <span *ngIf="!loading">Iniciar Sesión</span>
                </button>
              </div>

              <div class="text-center mt-3">
                <a routerLink="/auth/forgot-password" class="text-decoration-none">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <div class="text-center mt-2">
                <span>¿No tienes cuenta? </span>
                <a routerLink="/auth/register" class="text-decoration-none">
                  Regístrate aquí
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 20px;
    }
    
    .login-card {
      width: 100%;
      max-width: 400px;
    }
    
    .w-100 {
      width: 100%;
    }
    
    .text-decoration-none {
      text-decoration: none;
    }
    
    .text-decoration-none:hover {
      text-decoration: underline;
    }
    
    .is-invalid {
      border-color: #dc3545;
    }
    
    .invalid-feedback {
      display: block;
      width: 100%;
      margin-top: 0.25rem;
      font-size: 0.875rem;
      color: #dc3545;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginData: LoginRequest = {
    email: '',
    password: ''
  };
  
  loading = false;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Si ya está autenticado, redirigir al dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.loading) return;

    this.loading = true;
    
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        this.authService.setUserData(response.data);
        this.notificationService.showSuccess('Inicio de sesión exitoso');
        this.router.navigate(['/dashboard']);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error en login:', error);
        this.notificationService.showError('Error al iniciar sesión. Verifica tus credenciales.');
        this.loading = false;
      }
    });
  }
}

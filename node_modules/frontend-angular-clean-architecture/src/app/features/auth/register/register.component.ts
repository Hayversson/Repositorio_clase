import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { CreateUsuarioRequest } from '../../../shared/models/usuario.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="register-container">
      <div class="register-card">
        <div class="card">
          <div class="card-header text-center">
            <h2 class="card-title">Registrarse</h2>
          </div>
          
          <div class="card-body">
            <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
              <div class="form-group">
                <label for="email" class="form-label">Email</label>
                <input 
                  type="email" 
                  id="email"
                  class="form-control" 
                  [(ngModel)]="registerData.email"
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
                  [(ngModel)]="registerData.password"
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
                <label for="nombre" class="form-label">Nombre</label>
                <input 
                  type="text" 
                  id="nombre"
                  class="form-control" 
                  [(ngModel)]="registerData.nombre"
                  name="nombre"
                  required
                  minlength="2"
                  #nombre="ngModel"
                  [class.is-invalid]="nombre.invalid && nombre.touched"
                >
                <div class="invalid-feedback" *ngIf="nombre.invalid && nombre.touched">
                  <div *ngIf="nombre.errors?.['required']">El nombre es requerido</div>
                  <div *ngIf="nombre.errors?.['minlength']">El nombre debe tener al menos 2 caracteres</div>
                </div>
              </div>

              <div class="form-group">
                <label for="apellido" class="form-label">Apellido</label>
                <input 
                  type="text" 
                  id="apellido"
                  class="form-control" 
                  [(ngModel)]="registerData.apellido"
                  name="apellido"
                  required
                  minlength="2"
                  #apellido="ngModel"
                  [class.is-invalid]="apellido.invalid && apellido.touched"
                >
                <div class="invalid-feedback" *ngIf="apellido.invalid && apellido.touched">
                  <div *ngIf="apellido.errors?.['required']">El apellido es requerido</div>
                  <div *ngIf="apellido.errors?.['minlength']">El apellido debe tener al menos 2 caracteres</div>
                </div>
              </div>

              <div class="form-group">
                <button 
                  type="submit" 
                  class="btn btn-primary w-100"
                  [disabled]="registerForm.invalid || loading"
                >
                  <span *ngIf="loading">Registrando...</span>
                  <span *ngIf="!loading">Registrarse</span>
                </button>
              </div>

              <div class="text-center mt-3">
                <span>¿Ya tienes cuenta? </span>
                <a routerLink="/auth/login" class="text-decoration-none">
                  Inicia sesión aquí
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 20px;
    }
    
    .register-card {
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
export class RegisterComponent implements OnInit {
  registerData: CreateUsuarioRequest = {
    email: '',
    password: '',
    nombre: '',
    apellido: ''
  };
  
  loading = false;

  constructor(
    private usuarioService: UsuarioService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Si ya está autenticado, redirigir al dashboard
    // TODO: Implementar verificación de autenticación
  }

  onSubmit(): void {
    if (this.loading) return;

    this.loading = true;
    
    this.usuarioService.createUsuario(this.registerData).subscribe({
      next: (response) => {
        this.notificationService.showSuccess('Usuario registrado exitosamente');
        this.router.navigate(['/auth/login']);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error en registro:', error);
        this.notificationService.showError('Error al registrar usuario. Intenta nuevamente.');
        this.loading = false;
      }
    });
  }
}

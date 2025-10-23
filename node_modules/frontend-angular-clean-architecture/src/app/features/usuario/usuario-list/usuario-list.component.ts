import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario, UsuarioFilters } from '../../../shared/models/usuario.model';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="usuario-list">
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Gestión de Usuarios</h2>
          <button class="btn btn-success" (click)="openCreateModal()">
            Nuevo Usuario
          </button>
        </div>
        
        <div class="card-body">
          <!-- Filtros -->
          <div class="filters mb-3">
            <div class="row">
              <div class="col-md-3">
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Buscar por email..."
                  [(ngModel)]="filters.email"
                  (input)="onFilterChange()"
                >
              </div>
              <div class="col-md-3">
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Buscar por nombre..."
                  [(ngModel)]="filters.nombre"
                  (input)="onFilterChange()"
                >
              </div>
              <div class="col-md-2">
                <select 
                  class="form-control" 
                  [(ngModel)]="filters.activo"
                  (change)="onFilterChange()"
                >
                  <option value="">Todos los estados</option>
                  <option value="true">Activos</option>
                  <option value="false">Inactivos</option>
                </select>
              </div>
              <div class="col-md-2">
                <button class="btn btn-secondary" (click)="clearFilters()">
                  Limpiar
                </button>
              </div>
            </div>
          </div>

          <!-- Tabla de usuarios -->
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Estado</th>
                  <th>Último Acceso</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngIf="loading">
                  <td colspan="7" class="text-center">Cargando...</td>
                </tr>
                <tr *ngIf="!loading && usuarios.length === 0">
                  <td colspan="7" class="text-center">No hay usuarios disponibles</td>
                </tr>
                <tr *ngFor="let usuario of usuarios">
                  <td>{{ usuario.id }}</td>
                  <td>{{ usuario.email }}</td>
                  <td>{{ usuario.nombre }}</td>
                  <td>{{ usuario.apellido }}</td>
                  <td>
                    <span class="badge" [class.badge-success]="usuario.activo" [class.badge-danger]="!usuario.activo">
                      {{ usuario.activo ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>
                  <td>{{ usuario.ultimo_acceso | date:'short' || '-' }}</td>
                  <td>
                    <button class="btn btn-sm btn-primary" (click)="editUsuario(usuario)">
                      Editar
                    </button>
                    <button class="btn btn-sm btn-danger" (click)="deleteUsuario(usuario)">
                      Eliminar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Paginación -->
          <div class="pagination mt-3" *ngIf="totalPages > 1">
            <button 
              class="btn btn-secondary" 
              [disabled]="currentPage === 1"
              (click)="goToPage(currentPage - 1)"
            >
              Anterior
            </button>
            <span class="mx-3">
              Página {{ currentPage }} de {{ totalPages }}
            </span>
            <button 
              class="btn btn-secondary" 
              [disabled]="currentPage === totalPages"
              (click)="goToPage(currentPage + 1)"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .badge {
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
    }
    
    .badge-success {
      background-color: #28a745;
      color: white;
    }
    
    .badge-danger {
      background-color: #dc3545;
      color: white;
    }
    
    .table-responsive {
      overflow-x: auto;
    }
    
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `]
})
export class UsuarioListComponent implements OnInit {
  usuarios: Usuario[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;
  
  filters: UsuarioFilters = {};

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.loading = true;
    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize
    };

    this.usuarioService.getUsuarios(pagination, this.filters).subscribe({
      next: (response) => {
        this.usuarios = response.data;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadUsuarios();
  }

  clearFilters(): void {
    this.filters = {};
    this.currentPage = 1;
    this.loadUsuarios();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadUsuarios();
    }
  }

  openCreateModal(): void {
    // TODO: Implementar modal para crear usuario
    console.log('Abrir modal de creación');
  }

  editUsuario(usuario: Usuario): void {
    // TODO: Implementar modal para editar usuario
    console.log('Editar usuario:', usuario);
  }

  deleteUsuario(usuario: Usuario): void {
    if (confirm(`¿Está seguro de eliminar el usuario "${usuario.email}"?`)) {
      this.usuarioService.deleteUsuario(usuario.id).subscribe({
        next: () => {
          this.loadUsuarios();
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
        }
      });
    }
  }
}

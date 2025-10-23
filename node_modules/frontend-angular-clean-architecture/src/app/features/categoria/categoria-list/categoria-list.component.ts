import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { CategoriaService } from '../../../core/services/categoria.service';
import { Categoria, CategoriaFilters } from '../../../shared/models/categoria.model';

@Component({
  selector: 'app-categoria-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="categoria-list">
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Gestión de Categorías</h2>
          <button class="btn btn-success" (click)="openCreateModal()">
            Nueva Categoría
          </button>
        </div>
        
        <div class="card-body">
          <!-- Filtros -->
          <div class="filters mb-3">
            <div class="row">
              <div class="col-md-4">
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Buscar por nombre..."
                  [(ngModel)]="filters.nombre"
                  (input)="onFilterChange()"
                >
              </div>
              <div class="col-md-3">
                <select 
                  class="form-control" 
                  [(ngModel)]="filters.activa"
                  (change)="onFilterChange()"
                >
                  <option value="">Todos los estados</option>
                  <option value="true">Activas</option>
                  <option value="false">Inactivas</option>
                </select>
              </div>
              <div class="col-md-2">
                <button class="btn btn-secondary" (click)="clearFilters()">
                  Limpiar
                </button>
              </div>
            </div>
          </div>

          <!-- Tabla de categorías -->
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Estado</th>
                  <th>Fecha Creación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngIf="loading">
                  <td colspan="6" class="text-center">Cargando...</td>
                </tr>
                <tr *ngIf="!loading && categorias.length === 0">
                  <td colspan="6" class="text-center">No hay categorías disponibles</td>
                </tr>
                <tr *ngFor="let categoria of categorias">
                  <td>{{ categoria.id }}</td>
                  <td>{{ categoria.nombre }}</td>
                  <td>{{ categoria.descripcion || '-' }}</td>
                  <td>
                    <span class="badge" [class.badge-success]="categoria.activa" [class.badge-danger]="!categoria.activa">
                      {{ categoria.activa ? 'Activa' : 'Inactiva' }}
                    </span>
                  </td>
                  <td>{{ categoria.fecha_creacion | date:'short' }}</td>
                  <td>
                    <button class="btn btn-sm btn-primary" (click)="editCategoria(categoria)">
                      Editar
                    </button>
                    <button class="btn btn-sm btn-danger" (click)="deleteCategoria(categoria)">
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
export class CategoriaListComponent implements OnInit {
  categorias: Categoria[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;
  
  filters: CategoriaFilters = {};

  constructor(private categoriaService: CategoriaService) { }

  ngOnInit(): void {
    this.loadCategorias();
  }

  loadCategorias(): void {
    this.loading = true;
    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize
    };

    this.categoriaService.getCategorias(pagination, this.filters).subscribe({
      next: (response) => {
        this.categorias = response.data;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadCategorias();
  }

  clearFilters(): void {
    this.filters = {};
    this.currentPage = 1;
    this.loadCategorias();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadCategorias();
    }
  }

  openCreateModal(): void {
    // TODO: Implementar modal para crear categoría
    console.log('Abrir modal de creación');
  }

  editCategoria(categoria: Categoria): void {
    // TODO: Implementar modal para editar categoría
    console.log('Editar categoría:', categoria);
  }

  deleteCategoria(categoria: Categoria): void {
    if (confirm(`¿Está seguro de eliminar la categoría "${categoria.nombre}"?`)) {
      this.categoriaService.deleteCategoria(categoria.id).subscribe({
        next: () => {
          this.loadCategorias();
        },
        error: (error) => {
          console.error('Error al eliminar categoría:', error);
        }
      });
    }
  }
}

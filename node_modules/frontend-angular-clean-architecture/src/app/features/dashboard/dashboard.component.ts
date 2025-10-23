import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard">
      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header">
              <h2 class="card-title">Dashboard</h2>
            </div>
            <div class="card-body">
              <p>Bienvenido al sistema de gestión con arquitectura limpia.</p>
              
              <div class="row mt-4">
                <div class="col-md-4">
                  <div class="card">
                    <div class="card-body text-center">
                      <h5 class="card-title">Categorías</h5>
                      <p class="card-text">Gestiona las categorías de productos</p>
                      <a routerLink="/categorias" class="btn btn-primary">Ver Categorías</a>
                    </div>
                  </div>
                </div>
                
                <!-- <div class="col-md-4">
                  <div class="card">
                    <div class="card-body text-center">
                      <h5 class="card-title">Productos</h5>
                      <p class="card-text">Administra el catálogo de productos</p>
                      <a routerLink="/productos" class="btn btn-primary">Ver Productos</a>
                    </div>
                  </div>
                </div> -->
                
                <div class="col-md-4">
                  <div class="card">
                    <div class="card-body text-center">
                      <h5 class="card-title">Usuarios</h5>
                      <p class="card-text">Gestiona los usuarios del sistema</p>
                      <a routerLink="/usuarios" class="btn btn-primary">Ver Usuarios</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 20px 0;
    }
    
    .row {
      display: flex;
      flex-wrap: wrap;
      margin: 0 -15px;
    }
    
    .col-md-4, .col-md-12 {
      flex: 0 0 100%;
      max-width: 100%;
      padding: 0 15px;
      margin-bottom: 20px;
    }
    
    @media (min-width: 768px) {
      .col-md-4 {
        flex: 0 0 33.333333%;
        max-width: 33.333333%;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
    // Aquí se pueden cargar estadísticas del dashboard
  }
}

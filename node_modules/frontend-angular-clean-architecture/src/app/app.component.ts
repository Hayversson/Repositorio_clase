import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="container">
      <header class="text-center mt-4 mb-4">
        <h1>Frontend Angular - Arquitectura Limpia</h1>
        <p class="text-muted">Integración con API FastAPI</p>
      </header>
      
      <main>
        <router-outlet></router-outlet>
      </main>
      
      <footer class="text-center mt-4 mb-4">
        <p>&copy; 2025 - Proyecto de Programación de Software</p>
      </footer>
    </div>
  `,
  styles: [`
    .text-muted {
      color: #6c757d;
    }
  `]
})
export class AppComponent {
  title = 'frontend-angular-clean-architecture';
}

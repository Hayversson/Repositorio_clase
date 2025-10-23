# Frontend Angular - Arquitectura Limpia

Este proyecto implementa un frontend en Angular con arquitectura limpia para integrarse con una API FastAPI. La estructura está diseñada para ser escalable, mantenible y fácil de entender.

## Arquitectura del Proyecto

### Estructura de Carpetas

```
src/app/
├── core/                    # Funcionalidades centrales de la aplicación
│   ├── services/           # Servicios principales (API, Auth, Notifications)
│   ├── models/             # Modelos base y interfaces
│   ├── interceptors/       # Interceptores HTTP
│   └── guards/             # Guards de autenticación y autorización
├── shared/                 # Componentes y utilidades reutilizables
│   ├── components/         # Componentes compartidos
│   ├── directives/         # Directivas personalizadas
│   ├── pipes/              # Pipes personalizados
│   └── models/             # Modelos de entidades compartidas
└── features/               # Módulos de funcionalidades específicas
    ├── auth/               # Autenticación y autorización
    ├── categoria/          # Gestión de categorías
    ├── producto/           # Gestión de productos
    └── usuario/            # Gestión de usuarios
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn
- Angular CLI (versión 17 o superior)

### Instalación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   - Editar `src/environments/environment.ts` para desarrollo
   - Editar `src/environments/environment.prod.ts` para producción

3. **Ejecutar en modo desarrollo:**
   ```bash
   npm start
   ```

4. **Compilar para producción:**
   ```bash
   npm run build
   ```

## 🔌 Integración con API FastAPI

### Configuración de la API

El proyecto está configurado para conectarse con una API FastAPI. La URL base se define en los archivos de entorno:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api', // URL de tu API FastAPI
  appName: 'Frontend Angular - Arquitectura Limpia',
  version: '1.0.0'
};
```

### Servicios de API

#### Servicio Base (ApiService)

El `ApiService` es el servicio central que maneja todas las comunicaciones HTTP con la API:

```typescript
// src/app/core/services/api.service.ts
export class ApiService {
  // Métodos para GET, POST, PUT, DELETE
  // Manejo de paginación
  // Configuración de headers
}
```

#### Servicios Específicos

Cada entidad tiene su propio servicio que extiende la funcionalidad del `ApiService`:

- **CategoriaService**: Gestión de categorías
- **ProductoService**: Gestión de productos  
- **UsuarioService**: Gestión de usuarios
- **AuthService**: Autenticación y autorización

### Ejemplo de Integración

#### 1. Configurar un nuevo endpoint

```typescript
// En el servicio correspondiente
getNuevoEndpoint(): Observable<ApiResponse<MiModelo>> {
  return this.apiService.get<MiModelo>('/mi-endpoint');
}
```

#### 2. Usar en un componente

```typescript
// En el componente
ngOnInit(): void {
  this.miService.getNuevoEndpoint().subscribe({
    next: (response) => {
      this.datos = response.data;
    },
    error: (error) => {
      console.error('Error:', error);
    }
  });
}
```

## Autenticación

### Flujo de Autenticación

1. **Login**: El usuario ingresa credenciales
2. **Token**: Se almacena el token JWT en localStorage
3. **Interceptor**: Se agrega automáticamente el token a las peticiones
4. **Guards**: Se protegen las rutas que requieren autenticación

### Configuración de Rutas Protegidas

```typescript
// En app.routes.ts
{
  path: 'dashboard',
  loadComponent: () => import('./features/dashboard/dashboard.component'),
  canActivate: [AuthGuard] // Proteger la ruta
}
```

## Componentes Principales

### Dashboard
- Vista principal con resumen del sistema
- Navegación a diferentes módulos
- Estadísticas básicas

### Gestión de Categorías
- Lista paginada de categorías
- Filtros de búsqueda
- CRUD completo (Crear, Leer, Actualizar, Eliminar)

### Gestión de Productos
- Lista paginada de productos
- Filtros avanzados (precio, categoría, stock)
- CRUD completo

### Gestión de Usuarios
- Lista paginada de usuarios
- Filtros de búsqueda
- Gestión de estados

## Estilos y UI

### Framework CSS
- Estilos personalizados en SCSS
- Clases utilitarias para espaciado y colores
- Diseño responsive

### Componentes Reutilizables
- Cards
- Botones
- Formularios
- Tablas
- Modales (por implementar)

## Interceptores

### AuthInterceptor
Agrega automáticamente el token de autenticación a las peticiones HTTP.

### ErrorInterceptor
Maneja errores HTTP globalmente y muestra notificaciones al usuario.

## Manejo de Estado

### Servicios de Estado
- **AuthService**: Estado de autenticación
- **NotificationService**: Notificaciones globales

### Patrón Observable
Uso de RxJS para manejo reactivo de datos y estado.

## Testing

### Configuración de Testing
```bash
# Ejecutar tests unitarios
npm test

# Ejecutar tests con coverage
npm run test:coverage
```

## Build y Deploy

### Desarrollo
```bash
npm start
# Servidor en http://localhost:4200
```

### Producción
```bash
npm run build
# Archivos compilados en dist/
```

## Integración con FastAPI

### Endpoints Esperados

El frontend espera que la API FastAPI tenga los siguientes endpoints:

#### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrarse
- `POST /api/auth/forgot-password` - Recuperar contraseña

#### Categorías
- `GET /api/categorias` - Listar categorías (paginado)
- `GET /api/categorias/{id}` - Obtener categoría por ID
- `POST /api/categorias` - Crear categoría
- `PUT /api/categorias/{id}` - Actualizar categoría
- `DELETE /api/categorias/{id}` - Eliminar categoría

#### Productos
- `GET /api/productos` - Listar productos (paginado)
- `GET /api/productos/{id}` - Obtener producto por ID
- `POST /api/productos` - Crear producto
- `PUT /api/productos/{id}` - Actualizar producto
- `DELETE /api/productos/{id}` - Eliminar producto

#### Usuarios
- `GET /api/usuarios` - Listar usuarios (paginado)
- `GET /api/usuarios/{id}` - Obtener usuario por ID
- `POST /api/usuarios` - Crear usuario
- `PUT /api/usuarios/{id}` - Actualizar usuario
- `DELETE /api/usuarios/{id}` - Eliminar usuario

### Formato de Respuesta

Todas las respuestas deben seguir este formato:

```json
{
  "data": {}, // Datos de la respuesta
  "message": "Mensaje descriptivo",
  "success": true,
  "status": 200
}
```

Para respuestas paginadas:

```json
{
  "data": [], // Array de elementos
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

## Próximos Pasos

1. **Implementar modales** para crear/editar entidades
2. **Agregar validaciones** más robustas en formularios
3. **Implementar guards** de autorización
4. **Agregar tests unitarios** para componentes y servicios
5. **Implementar lazy loading** para módulos
6. **Agregar PWA** (Progressive Web App) capabilities
7. **Implementar internacionalización** (i18n)

## Notas de Desarrollo

- El proyecto usa Angular 17 con standalone components
- Se implementa arquitectura limpia para mejor mantenibilidad
- Los servicios están preparados para integración con FastAPI
- Se incluyen interceptores para manejo automático de autenticación y errores
- La estructura es escalable y fácil de extender

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

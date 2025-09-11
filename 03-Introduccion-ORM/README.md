# Introducción a ORM con SQLAlchemy y PostgreSQL (Neon)

Este proyecto demuestra el uso de SQLAlchemy ORM para conectarse a PostgreSQL usando Neon como base de datos en la nube, incluyendo migraciones con Alembic y operaciones CRUD básicas.

## 🚀 Inicio Rápido

Si quieres empezar inmediatamente:

1. **Instala las dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configura Neon:**
   - Crea una cuenta en [neon.tech](https://neon.tech)
   - Crea un nuevo proyecto
   - Copia la cadena de conexión

3. **Configura las variables de entorno:**
   ```bash
   cp env.example .env
   # Edita .env con tu cadena de conexión de Neon
   ```

4. **Crea las tablas automáticamente:**
   ```bash
   python test_connection.py
   ```

5. **¡Ejecuta el proyecto!**
   ```bash
   python main.py
   ```

¿Necesitas más detalles? Continúa leyendo la guía completa abajo.

## Estructura del Proyecto

```
03-Introduccion-ORM/
├── database/           # Configuración de base de datos
│   ├── __init__.py
│   └── config.py      # Configuración de conexión
├── entities/          # Modelos de entidades
│   ├── __init__.py
│   ├── usuario.py     # Modelo Usuario
│   ├── categoria.py   # Modelo Categoría
│   └── producto.py    # Modelo Producto
├── crud/             # Operaciones CRUD
│   ├── __init__.py
│   ├── usuario_crud.py
│   ├── categoria_crud.py
│   └── producto_crud.py
├── migrations/       # Migraciones de Alembic
│   ├── env.py
│   └── script.py.mako
├── alembic.ini       # Configuración de Alembic
├── main.py          # Archivo principal de demostración
├── requirements.txt # Dependencias del proyecto
└── README.md        # Este archivo
```

## Instalación y Configuración

### 1. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 2. Configurar Neon Database

#### Paso 1: Crear cuenta en Neon
1. Ve a [neon.tech](https://neon.tech) y crea una cuenta gratuita
2. Inicia sesión en tu dashboard de Neon

#### Paso 2: Crear una nueva base de datos
1. En el dashboard, haz clic en "Create Project"
2. Elige un nombre para tu proyecto (ej: `mi-proyecto-orm`)
3. Selecciona la región más cercana a tu ubicación
4. Haz clic en "Create Project"

#### Paso 3: Obtener la cadena de conexión
1. Una vez creado el proyecto, ve a la sección "Connection Details"
2. Copia la cadena de conexión que aparece (algo como: `postgresql://usuario:password@host/database?sslmode=require`)
3. También anota los datos individuales:
   - **Host**: El host de tu base de datos
   - **Database**: El nombre de la base de datos
   - **Username**: Tu nombre de usuario
   - **Password**: Tu contraseña
   - **Port**: 5432 (por defecto)

### 3. Configurar variables de entorno

1. Copia el archivo de ejemplo:
```bash
cp env.example .env
```

2. Edita el archivo `.env` con tus credenciales reales de Neon:

**Opción A: Usar la cadena de conexión completa (Recomendado)**
```env
DATABASE_URL=postgresql://usuario:password@host/database?sslmode=require
```

**Opción B: Usar variables individuales**
```env
DB_HOST=tu-host.neon.tech
DB_PORT=5432
DB_NAME=tu-base-de-datos
DB_USERNAME=tu-usuario
DB_PASSWORD=tu-password
```

### 4. Verificar la conexión

Ejecuta el script de prueba para verificar que la conexión funciona:

```bash
python test_connection.py
```

### 5. Crear las tablas automáticamente (Método Recomendado)

#### Opción A: Usar test_connection.py (Más fácil)
```bash
python test_connection.py
```

Este script:
- Verifica la conexión a Neon
- Crea automáticamente todas las tablas definidas en las entidades
- Muestra información de la base de datos
- Confirma que todo está funcionando

#### Opción B: Usar migraciones con Alembic (Para proyectos avanzados)

Si prefieres usar migraciones (recomendado para proyectos en producción):

##### Paso 1: Inicializar Alembic (solo la primera vez)
```bash
alembic init migrations
```

##### Paso 2: Configurar alembic.ini
El archivo `alembic.ini` ya está configurado, pero si necesitas modificarlo, asegúrate de que la línea `sqlalchemy.url` esté comentada o vacía, ya que usaremos las variables de entorno.

##### Paso 3: Crear la primera migración
```bash
alembic revision --autogenerate -m "Initial migration"
```

##### Paso 4: Aplicar las migraciones
```bash
alembic upgrade head
```

### 6. Verificar que todo funciona

Ejecuta el script principal para verificar que todo está funcionando:

```bash
python main.py
```

## Crear Nuevas Entidades y Migrarlas

### Método 1: Usando test_connection.py (Recomendado para desarrollo)

#### Paso 1: Crear tu nueva entidad
1. Ve a la carpeta `entities/`
2. Crea un nuevo archivo (ej: `mi_entidad.py`)
3. Define tu modelo siguiendo el patrón existente:

```python
from database.config import Base
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

class MiEntidad(Base):
    __tablename__ = "mi_entidad"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(String(500), nullable=True)
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())
```

#### Paso 2: Importar la entidad en entities/__init__.py
```python
from .mi_entidad import MiEntidad
```

#### Paso 3: Ejecutar test_connection.py
```bash
python test_connection.py
```

Este script creará automáticamente la nueva tabla en la base de datos.

### Método 2: Usando migraciones con Alembic (Recomendado para producción)

#### Paso 1: Crear la entidad (igual que el Método 1)

#### Paso 2: Crear migración automática
```bash
alembic revision --autogenerate -m "Agregar tabla MiEntidad"
```

#### Paso 3: Revisar la migración generada
Verifica el archivo en `migrations/versions/` antes de aplicarlo.

#### Paso 4: Aplicar la migración
```bash
alembic upgrade head
```

### Flujo de trabajo recomendado

1. **Desarrollo inicial**: Usa `test_connection.py` para crear tablas rápidamente
2. **Cambios en producción**: Usa migraciones de Alembic para control de versiones
3. **Siempre revisa**: Las migraciones generadas antes de aplicarlas

## Uso del Proyecto

### Ejecutar la demostración

```bash
python main.py
```

Este script:
- Crea las tablas en la base de datos
- Inserta datos de ejemplo
- Demuestra operaciones CRUD
- Muestra consultas con relaciones
- Ejecuta consultas avanzadas

### Operaciones CRUD Disponibles

#### Usuario
- `crear_usuario(nombre, email, telefono, es_admin=False)`
- `obtener_usuario(id_usuario)`
- `obtener_usuario_por_email(email)`
- `obtener_usuarios(skip, limit)`
- `actualizar_usuario(id_usuario, **kwargs)`
- `eliminar_usuario(id_usuario)`
- `desactivar_usuario(id_usuario)`
- `obtener_usuarios_admin()` - Obtener todos los administradores
- `es_admin(id_usuario)` - Verificar si es administrador
- `obtener_admin_por_defecto()` - Obtener el admin del sistema

#### Categoría
- `crear_categoria(nombre, descripcion, id_usuario_crea=None)`
- `obtener_categoria(id_categoria)`
- `obtener_categoria_por_nombre(nombre)`
- `obtener_categorias(skip, limit)`
- `actualizar_categoria(id_categoria, id_usuario_edita=None, **kwargs)`
- `eliminar_categoria(id_categoria)`

#### Producto
- `crear_producto(nombre, descripcion, precio, stock, categoria_id, usuario_id, id_usuario_crea=None)`
- `obtener_producto(id_producto)`
- `obtener_productos(skip, limit)`
- `obtener_productos_por_categoria(categoria_id)`
- `obtener_productos_por_usuario(usuario_id)`
- `buscar_productos_por_nombre(nombre)`
- `actualizar_producto(id_producto, id_usuario_edita=None, **kwargs)`
- `actualizar_stock(id_producto, nuevo_stock)`
- `eliminar_producto(id_producto)`

## Modelos de Datos

### Usuario
- `id_usuario`: Clave primaria
- `nombre`: Nombre del usuario
- `email`: Email único
- `telefono`: Teléfono (opcional)
- `activo`: Estado del usuario
- `es_admin`: Indica si el usuario es administrador
- `fecha_creacion`: Fecha de creación
- `fecha_edicion`: Fecha de última edición

### Categoría
- `id_categoria`: Clave primaria
- `nombre`: Nombre de la categoría (único)
- `descripcion`: Descripción de la categoría
- `fecha_creacion`: Fecha de creación
- `fecha_edicion`: Fecha de última edición
- `id_usuario_crea`: ID del usuario que creó la categoría
- `id_usuario_edita`: ID del usuario que editó la categoría por última vez

### Producto
- `id_producto`: Clave primaria
- `nombre`: Nombre del producto
- `descripcion`: Descripción del producto
- `precio`: Precio del producto
- `stock`: Cantidad en stock
- `categoria_id`: Clave foránea a Categoría
- `usuario_id`: Clave foránea a Usuario (propietario)
- `fecha_creacion`: Fecha de creación
- `fecha_edicion`: Fecha de última edición
- `id_usuario_crea`: ID del usuario que creó el producto
- `id_usuario_edita`: ID del usuario que editó el producto por última vez

## Relaciones

- **Usuario** → **Producto**: Un usuario puede tener muchos productos (1:N)
- **Categoría** → **Producto**: Una categoría puede tener muchos productos (1:N)
- **Usuario** → **Categoría** (creación): Un usuario puede crear muchas categorías (1:N)
- **Usuario** → **Categoría** (edición): Un usuario puede editar muchas categorías (1:N)
- **Usuario** → **Producto** (creación): Un usuario puede crear muchos productos (1:N)
- **Usuario** → **Producto** (edición): Un usuario puede editar muchos productos (1:N)

## Sistema de Auditoría

El proyecto incluye un sistema completo de auditoría que rastrea:

### Campos de Auditoría Automáticos
- **fecha_creacion**: Se establece automáticamente al crear un registro
- **fecha_edicion**: Se actualiza automáticamente al modificar un registro
- **id_usuario_crea**: ID del usuario que creó el registro
- **id_usuario_edita**: ID del usuario que editó el registro por última vez

### Usuario Administrador
Al ejecutar `python test_connection.py`, se crea automáticamente un usuario administrador:
- **Email**: `admin@system.com`
- **Nombre**: `Administrador`
- **Es Admin**: `True`
- **Activo**: `True`

Este usuario se usa como fallback cuando no se especifica un usuario para operaciones de auditoría.

## Dependencias del Proyecto

El proyecto utiliza las siguientes dependencias principales:

- **SQLAlchemy 2.0.23**: ORM para Python
- **psycopg2-binary 2.9.9**: Adaptador PostgreSQL para Python
- **asyncpg 0.29.0**: Adaptador asíncrono para PostgreSQL
- **Alembic 1.13.1**: Herramienta de migraciones para SQLAlchemy
- **python-dotenv 1.0.0**: Carga de variables de entorno desde archivos .env

## Comandos Útiles de Alembic

### Comandos básicos de migración

```bash
# Ver historial de migraciones
alembic history

# Ver migración actual
alembic current

# Aplicar migraciones hasta la última
alembic upgrade head

# Revertir a una migración específica
alembic downgrade <revision_id>

# Crear nueva migración automática
alembic revision --autogenerate -m "Descripción del cambio"
```

### Comandos avanzados

```bash
# Aplicar migraciones hasta una versión específica
alembic upgrade <revision_id>

# Revertir todas las migraciones
alembic downgrade base

# Ver diferencias entre el modelo y la base de datos
alembic revision --autogenerate -m "Revisar cambios" --sql

# Ejecutar migración específica
alembic upgrade <revision_id> --sql
```

### Flujo de trabajo típico

1. **Modificar modelos**: Edita los archivos en `entities/`
2. **Crear migración**: `alembic revision --autogenerate -m "Descripción"`
3. **Revisar migración**: Verifica el archivo generado en `migrations/versions/`
4. **Aplicar migración**: `alembic upgrade head`
5. **Verificar cambios**: `alembic current`

## Notas Importantes

1. **Conexión SSL**: Neon requiere conexiones SSL por defecto. La cadena de conexión incluye `?sslmode=require`.

2. **Límites de Neon**: La cuenta gratuita tiene límites de uso. Consulta la documentación de Neon para más detalles.

3. **Variables de entorno**: Nunca subas el archivo `.env` al control de versiones por seguridad.

4. **Pool de conexiones**: El proyecto está configurado con `pool_pre_ping=True` para verificar conexiones antes de usarlas.

5. **Timezone**: Las fechas se almacenan con timezone UTC por defecto.

## Solución de Problemas

### Error de conexión a Neon
```bash
# Verifica que la URL de conexión sea correcta
python test_connection.py
```

**Posibles causas:**
- URL de conexión incorrecta en `.env`
- Credenciales incorrectas
- Problemas de red o firewall
- Base de datos suspendida (cuenta gratuita)

**Soluciones:**
- Verifica la URL de conexión en el dashboard de Neon
- Confirma que la base de datos esté activa
- Prueba la conexión desde el dashboard de Neon

### Error de dependencias
```bash
# Reinstala las dependencias
pip install -r requirements.txt --force-reinstall
```

**Si tienes problemas con psycopg2:**
```bash
# En Windows, instala las dependencias del sistema
pip install psycopg2-binary

# En Linux/Mac, instala las dependencias del sistema
sudo apt-get install libpq-dev  # Ubuntu/Debian
brew install postgresql          # macOS
```

### Error de migraciones
```bash
# Verifica el estado actual
alembic current

# Si hay problemas, reinicia las migraciones
alembic downgrade base
alembic upgrade head
```

### Error de permisos
- Verifica que el usuario de Neon tenga permisos para crear tablas
- Asegúrate de que la base de datos exista y esté activa

### Problemas de SSL
Si tienes problemas con SSL, puedes modificar la URL de conexión:
```env
DATABASE_URL=postgresql://usuario:password@host/database?sslmode=disable
```
**Nota**: Solo haz esto en desarrollo, nunca en producción.

## Comandos de Diagnóstico

### Verificación rápida (Recomendado)
```bash
# Verificar conexión y crear tablas automáticamente
python test_connection.py
```

### Verificación con migraciones
```bash
# Verificar estado de migraciones
alembic current

# Ver historial de migraciones
alembic history

# Ver diferencias entre modelo y base de datos
alembic revision --autogenerate -m "Verificar cambios" --sql
```

### Pruebas de funcionalidad
```bash
# Probar operaciones CRUD
python main.py

# Probar conexión específica a Neon
python test_neon_connection.py

# Probar conexión asíncrona
python test_neon_async.py
```

## Recursos Adicionales

### Documentación Oficial
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Alembic Documentation](https://alembic.sqlalchemy.org/)
- [Neon Documentation](https://neon.tech/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### Conceptos Importantes

#### ORM (Object-Relational Mapping)
- **Ventajas**: Código más limpio, independencia de base de datos, validaciones automáticas
- **Desventajas**: Curva de aprendizaje, overhead de rendimiento en consultas complejas

#### Migraciones
- **¿Qué son?**: Scripts que modifican la estructura de la base de datos de forma controlada
- **¿Por qué usarlas?**: Control de versiones de la base de datos, despliegue seguro, rollback fácil

#### Neon vs Bases de Datos Tradicionales
- **Ventajas**: Sin configuración, escalado automático, respaldos automáticos, SSL incluido
- **Consideraciones**: Límites en cuenta gratuita, dependencia de internet

## Estructura de Archivos Detallada

```
03-Introduccion-ORM/
├── database/
│   ├── __init__.py          # Inicialización del paquete
│   └── config.py            # Configuración de conexión y motor SQLAlchemy
├── entities/                # Modelos de datos (Entidades)
│   ├── __init__.py
│   ├── usuario.py           # Modelo Usuario con relaciones
│   ├── categoria.py         # Modelo Categoría
│   └── producto.py          # Modelo Producto con claves foráneas
├── crud/                    # Operaciones de base de datos
│   ├── __init__.py
│   ├── usuario_crud.py      # CRUD para Usuario
│   ├── categoria_crud.py    # CRUD para Categoría
│   └── producto_crud.py     # CRUD para Producto
├── migrations/              # Migraciones de Alembic
│   ├── env.py              # Configuración del entorno de migraciones
│   ├── script.py.mako      # Plantilla para archivos de migración
│   └── versions/           # Archivos de migración generados
├── alembic.ini             # Configuración de Alembic
├── main.py                 # Script principal de demostración
├── test_connection.py      # Script para probar la conexión
├── test_neon_connection.py # Script específico para probar Neon
├── test_neon_async.py      # Script para probar conexión asíncrona
├── requirements.txt        # Dependencias del proyecto
├── env.example            # Plantilla de variables de entorno
└── README.md              # Este archivo
```

## Próximos Pasos

1. **Explora los modelos**: Modifica las entidades en `entities/` para agregar nuevos campos
2. **Crea nuevas entidades**: Sigue el patrón en `entities/` y usa `python test_connection.py` para crearlas
3. **Implementa más operaciones CRUD**: Agrega funciones en los archivos `crud/`
4. **Usa migraciones para producción**: Cuando estés listo, usa `alembic revision --autogenerate`
5. **Agrega validaciones**: Usa SQLAlchemy validators para validar datos
6. **Implementa tests**: Crea tests unitarios para tus operaciones CRUD
7. **Optimiza consultas**: Usa `lazy loading` y `eager loading` según necesites

### Flujo de trabajo recomendado:
- **Desarrollo**: Usa `test_connection.py` para cambios rápidos
- **Producción**: Usa migraciones de Alembic para control de versiones
- **Siempre**: Revisa los cambios antes de aplicarlos

## Contribuir

Si encuentras errores o tienes sugerencias:
1. Crea un issue describiendo el problema
2. Fork el proyecto
3. Crea una rama para tu feature
4. Haz commit de tus cambios
5. Envía un pull request

---

**¡Disfruta aprendiendo ORM con SQLAlchemy y Neon! 🚀**

# Introducción a ORM (Object-Relational Mapping)

## ¿Qué es ORM?

ORM (Object-Relational Mapping) es una técnica de programación que permite convertir datos entre sistemas de tipos incompatibles en lenguajes de programación orientados a objetos. En términos simples, **ORM nos permite trabajar con bases de datos usando objetos de Python en lugar de escribir SQL directamente**.

### ¿Por qué usar ORM?

Antes de ORM, los desarrolladores tenían que escribir consultas SQL manualmente, lo que presentaba varios problemas:

- **Código repetitivo**: Escribir las mismas consultas SQL una y otra vez
- **Dependencia de la base de datos**: El código SQL era específico para cada motor de base de datos
- **Vulnerabilidades de seguridad**: Riesgo de inyecciones SQL
- **Mantenimiento complejo**: Cambios en la estructura de la base requerían modificar múltiples archivos
- **Falta de tipado**: No había validación de tipos en tiempo de compilación

## Ventajas del ORM

- **Productividad**: Menos código repetitivo y más tiempo enfocado en la lógica de negocio
- **Mantenibilidad**: Código más limpio, organizado y fácil de mantener
- **Portabilidad**: Funciona con diferentes bases de datos (SQLite, PostgreSQL, MySQL, etc.)
- **Seguridad**: Previene inyecciones SQL automáticamente
- **Tipado**: Mejor control de tipos de datos y validaciones
- **Abstracción**: No necesitas conocer SQL avanzado para operaciones complejas
- **Consistencia**: Patrones uniformes para todas las operaciones de base de datos

## Conceptos Clave

### 1. **Modelo (Model)**
Representa una tabla de la base de datos como una clase de Python. Cada instancia de la clase representa una fila en la tabla, y cada atributo de la clase representa una columna.

```python
class Usuario(Base):
    __tablename__ = 'usuarios'
    id = Column(Integer, primary_key=True)
    nombre = Column(String(100))
    email = Column(String(120))
```

### 2. **Sesión (Session)**
Maneja la conexión y transacciones con la base de datos. Es como un "carrito de compras" que acumula cambios antes de enviarlos a la base de datos.

```python
session = Session()
session.add(nuevo_usuario)  # Agregar a la sesión
session.commit()             # Confirmar cambios
session.rollback()           # Deshacer cambios
```

### 3. **Query (Consulta)**
Permite realizar consultas a la base de datos usando métodos de Python en lugar de SQL. SQLAlchemy traduce estas consultas a SQL optimizado.

```python
# En lugar de: SELECT * FROM usuarios WHERE email = 'juan@email.com'
usuarios = session.query(Usuario).filter_by(email='juan@email.com').all()
```

### 4. **Migración**
Proceso de actualizar la estructura de la base de datos cuando cambias los modelos. Herramientas como Alembic automatizan este proceso.

### 5. **Relaciones**
ORM permite definir relaciones entre modelos de forma declarativa:

- **One-to-One**: Un usuario tiene un perfil
- **One-to-Many**: Una categoría tiene muchos productos
- **Many-to-Many**: Un producto puede estar en múltiples categorías

## Ejemplos Incluidos

- `ejemplo_basico.py`: Conceptos fundamentales de ORM
- `ejemplo_avanzado.py`: Relaciones entre modelos y consultas complejas
- `requirements.txt`: Dependencias necesarias

## Instalación

```bash
pip install -r requirements.txt
```

## Uso

```bash
python ejemplo_basico.py
python ejemplo_avanzado.py
```

## Recursos Adicionales

- [Documentación oficial de SQLAlchemy](https://docs.sqlalchemy.org/)
- [Tutorial de ORM con Python](https://realpython.com/python-sqlite-sqlalchemy/)
- [Patrones de diseño en ORM](https://martinfowler.com/eaaCatalog/)

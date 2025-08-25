# Pydantic — Guía desde 0 hasta intermedio (README.md)

> **Nivel**: tienes lógica de programación, conoces POO y estás viendo programación de software.  
> **Objetivo**: entender **qué es Pydantic**, cómo usarlo para **validar, transformar y serializar datos**, y aplicar buenas prácticas en proyectos reales (scripts, CLI, web APIs con FastAPI, ETL, etc.).  
> **Versión**: esta guía asume **Pydantic 2.x** (cambió bastante respecto a 1.x).

---

## 1) ¿Qué es Pydantic y por qué usarlo?

**Pydantic** es una librería de Python que te permite **definir modelos de datos** (clases) con **tipos** y **reglas de validación** usando *type hints*.  
Con esos modelos, puedes **validar** y **convertir** (parsear) datos de entradas reales (JSON, formularios, archivos, variables de entorno), y **serializarlos** nuevamente (por ejemplo, para guardarlos o enviarlos por red).

**Beneficios clave**  
- ✅ Menos `if` y chequeos manuales.  
- ✅ Convierte tipos automáticamente (ej.: `"20"` → `20`).  
- ✅ Errores de validación claros y estructurados.  
- ✅ Genera **JSON Schema** de tus modelos (ideal para documentación/contract-first).  
- ✅ Integración natural con **FastAPI** y **pydantic-settings** (config por env).

**Cuándo usarlo**  
- Validar *payloads* de API o formularios.  
- Procesar archivos CSV/JSON con datos “sucios”.  
- Definir **DTOs** (Data Transfer Objects) entre capas de tu aplicación.  
- Cargar configuración desde `.env`/variables de entorno.

> **Requisitos**: Python ≥ 3.8.  
> **Instalación**:  
> ```bash
> pip install pydantic
> # para configuración por variables de entorno
> pip install pydantic-settings
> ```

---

## 2) Tu primer modelo

```python
from pydantic import BaseModel

class Usuario(BaseModel):
    nombre: str
    edad: int

u = Usuario(nombre="Ana", edad="20")  # convierte "20" -> 20
print(u)  # Usuario(nombre='Ana', edad=20)

# serializar (dict / json)
print(u.model_dump())        # {'nombre': 'Ana', 'edad': 20}
print(u.model_dump_json())   # '{"nombre":"Ana","edad":20}'
```

- `BaseModel` define un **modelo**.  
- Pydantic **valida y convierte** según los tipos (`str`, `int`, etc.).  
- Para **deserializar** datos: simplemente instancia el modelo con un `dict`/JSON ya cargado.  
- Para **serializar**: usa `model_dump()` (dict) o `model_dump_json()` (str JSON).

> **Nota de v2**: en Pydantic 2, `parse_obj`/`dict`/`json` se reemplazan por `model_validate`, `model_dump`, `model_dump_json` y el helper `TypeAdapter` (ver §8).

---

## 3) Campos, `Field` y metadatos

Puedes documentar y configurar cada campo:

```python
from typing import Optional
from pydantic import BaseModel, Field

class Producto(BaseModel):
    id: int = Field(..., description="Identificador interno", ge=1)
    nombre: str = Field(..., min_length=3, max_length=50)
    precio: float = Field(..., ge=0)
    descuento: Optional[float] = Field(None, ge=0, le=100, description="Porcentaje 0-100")
```

- `...` = obligatorio.  
- Restricciones numéricas comunes: `ge` (≥), `gt` (>), `le` (≤), `lt` (<).  
- Restricciones de cadena: `min_length`, `max_length`, `pattern` (regex).

---

## 4) Tipos comunes y estructuras

```python
from typing import List, Dict, Union, Optional
from pydantic import BaseModel
from enum import Enum

class Rol(str, Enum):
    admin = "admin"
    user = "user"

class Perfil(BaseModel):
    bio: Optional[str] = None
    redes: Dict[str, str] = {}

class Usuario(BaseModel):
    id: int
    nombre: str
    rol: Rol = Rol.user
    intereses: List[str] = []
    perfil: Perfil
```

- **Enum**: restringe a valores conocidos.  
- **Anidación**: usar modelos dentro de modelos.  
- **List/Dict**: colecciones tipadas se validan elemento a elemento.

---

## 5) Validación avanzada con `field_validator` y `model_validator` (v2)

En Pydantic 2, los antiguos `@validator` se reemplazan por:

- `@field_validator("campo")`: valida o transforma **un campo**.  
- `@model_validator(mode="before"/"after")`: valida/transforma a **nivel de modelo** (antes o después).

```python
from pydantic import BaseModel, field_validator, model_validator

class Registro(BaseModel):
    email: str
    password: str
    password2: str

    @field_validator("email")
    @classmethod
    def email_debe_tener_arroba(cls, v: str) -> str:
        if "@" not in v:
            raise ValueError("Email inválido")
        return v

    @model_validator(mode="after")
    def passwords_coinciden(self):
        if self.password != self.password2:
            raise ValueError("Las contraseñas no coinciden")
        return self
```

---

## 6) Campos calculados (`computed_field`) y valores por defecto

```python
from pydantic import BaseModel, computed_field

class Rectangulo(BaseModel):
    ancho: float
    alto: float

    @computed_field
    @property
    def area(self) -> float:
        return self.ancho * self.alto
```

- `computed_field` crea un **campo derivado** que aparece en `model_dump()`.

**Valores por defecto mutables**: evita `[]` o `{}` directamente. Usa `default_factory`:

```python
from pydantic import BaseModel, Field

class Carrito(BaseModel):
    items: list[str] = Field(default_factory=list)  # ✅ seguro
```

---

## 7) Tipos y restricciones con `Annotated` (recomendado en v2)

En v2, se prefiere `typing.Annotated` con `Field` o *constraints*:

```python
from typing import Annotated
from pydantic import BaseModel, StringConstraints, Field

NombreCorto = Annotated[str, StringConstraints(min_length=3, max_length=30)]
EdadPositiva = Annotated[int, Field(ge=0)]

class Persona(BaseModel):
    nombre: NombreCorto
    edad: EdadPositiva
```

> Los tipos `constr`, `conint`, etc. siguen existiendo pero `Annotated` es más flexible.

---

## 8) Validación de tipos *sin* modelo: `TypeAdapter`

Ideal para validar colecciones o tipos sueltos:

```python
from typing import List
from pydantic import TypeAdapter

ta = TypeAdapter(List[int])
val = ta.validate_python(["1", 2, 3])  # -> [1, 2, 3]
json_schema = ta.json_schema()
```

---

## 9) Serialización y control de salida

```python
from pydantic import BaseModel, Field

class Usuario(BaseModel):
    id: int
    nombre: str
    password: str = Field(exclude=True)  # no aparecerá en dumps
    email: str

u = Usuario(id=1, nombre="Ana", password="secreta", email="a@x.com")
print(u.model_dump())  # password excluido
print(u.model_dump_json(indent=2))  # bonito para logs
```

Opciones útiles de `model_dump()`:
- `exclude_none=True`: no incluir campos `None`.  
- `by_alias=True`: usar alias de campo (ver siguiente sección).

---

## 10) Alias, transformación de nombres y compatibilidad externa

Cuando tu API/DB usa nombres distintos a tus atributos Python:

```python
from pydantic import BaseModel, Field

class Usuario(BaseModel):
    user_id: int = Field(..., alias="userId")
    first_name: str = Field(..., alias="firstName")

payload = {"userId": 5, "firstName": "Ana"}
u = Usuario.model_validate(payload)
print(u.user_id)  # 5
print(u.model_dump(by_alias=True))  # {'userId': 5, 'firstName': 'Ana'}
```

---

## 11) Errores de validación

```python
from pydantic import BaseModel, ValidationError

class Compra(BaseModel):
    producto: str
    cantidad: int

try:
    Compra(producto="Teclado", cantidad="muchas")
except ValidationError as e:
    print(e.errors())
    # [{'type': 'int_parsing', 'loc': ('cantidad',), 'msg': 'Input should be a valid integer', ...}]
```

- Úsalos en **tests** para comprobar tus reglas.  
- `loc` indica el campo; en nested models verás rutas tipo `('items', 0, 'precio')`.

---

## 12) Modelos inmutables/frozen (ideal para DTOs)

```python
from pydantic import BaseModel, ConfigDict

class DTO(BaseModel):
    model_config = ConfigDict(frozen=True)  # hace el modelo inmutable
    id: int
    nombre: str

dto = DTO(id=1, nombre="X")
# dto.id = 2  -> TypeError
```

Otros flags útiles en `ConfigDict`:
- `validate_assignment=True` (valida al asignar).  
- `extra="forbid"` (rechaza campos no definidos).  
- `strict=True` (desactiva coerción flexible; ver §15).

---

## 13) Integración con entornos/`.env` (pydantic-settings)

Para **configuración** vía variables de entorno:

```python
# pip install pydantic-settings
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_prefix="APP_")
    debug: bool = False
    db_url: str
    timeout: int = 30

cfg = Settings()  # lee .env y/os env del sistema (APP_DB_URL, etc.)
```

Ejemplo `.env`:
```
APP_DB_URL=postgresql://user:pass@localhost:5432/db
APP_DEBUG=true
```

---

## 14) Fechas, tiempos y zonas horarias

```python
from datetime import datetime
from pydantic import BaseModel

class Evento(BaseModel):
    inicio: datetime  # acepta ISO 8601 ('2025-08-24T19:30:00Z')

e = Evento(inicio="2025-08-24T19:30:00Z")
print(e.inicio.tzinfo)  # tz-aware si traía zona
```

**Buenas prácticas**  
- Preferir timestamps **tz-aware** (`Z` o `+00:00`).  
- Normalizar a UTC internamente; convertir al presentar.  
- Si necesitas *strictness*, configúralo (ver §15).

---

## 15) Modo estricto vs coerción flexible

Por defecto, Pydantic intenta **convertir** valores (útil en vida real).  
Si quieres ser estricto:

```python
from pydantic import BaseModel, ConfigDict

class M(BaseModel):
    model_config = ConfigDict(strict=True)
    edad: int

M(edad="20")  # ❌ error (no convierte)
```

O por campo con `Field(strict=True)`.

---

## 16) Patrones de uso (arquitectura)

- **DTOs entre capas**: define modelos *request/response* en tu capa de aplicación; evitas acoplarte a entidades de ORM.  
- **Mapeo entrada/salida**: usa `alias` para API externas; `by_alias=True` al serializar.  
- **Validación de “puerta de entrada”**: valida todo input externo en el borde (controladores, CLI args parseados).  
- **Tipado de eventos** (colas, Pub/Sub): modelos para eventos garantizan contratos estables.  
- **ETL/ELT**: valida filas leídas antes de cargarlas; reporta `ValidationError.errors()` por archivo/línea.

---

## 17) Buenas prácticas y antipatrones

**Buenas prácticas**  
- Usa `default_factory` para mutables.  
- Usa `Annotated` con `Field`/`StringConstraints`.  
- Coloca reglas de negocio simples en validadores; la lógica compleja va **fuera** del modelo.  
- Usa `extra="forbid"` si el input debe ser exacto (evita campos “fantasma”).  
- Testea validaciones clave con `pytest` y `ValidationError`.

**Evita**  
- Mezclar persistencia (ORM) con DTOs Pydantic sin un mapeo claro.  
- Abusar de validadores para lógica pesada (E/S, DB); manténlos puros y rápidos.  
- “Ocultar” defaults importantes: documenta con `Field(description=...)`.

---

## 18) Migración rápida de v1 → v2 (si vienes de material viejo)

- `@validator` → `@field_validator` / `@model_validator`.  
- `parse_obj` → `model_validate`.  
- `dict()` → `model_dump()`.  
- `json()` → `model_dump_json()`.  
- `constr`/`conint` siguen, pero se recomienda `Annotated`.  
- Nuevos: `TypeAdapter`, `computed_field`, configuración con `ConfigDict`.

---

## 19) Mini-ejemplo “de la vida real” (API/servicio)

```python
from typing import Annotated, List
from pydantic import BaseModel, Field, StringConstraints, field_validator

Nombre = Annotated[str, StringConstraints(min_length=3, max_length=40)]

class Item(BaseModel):
    sku: Annotated[str, StringConstraints(pattern=r"^[A-Z0-9\-]{4,20}$")]
    nombre: Nombre
    precio: Annotated[float, Field(ge=0)]
    cantidad: Annotated[int, Field(ge=1)] = 1

class Orden(BaseModel):
    id: int
    cliente: Nombre
    items: List[Item]

    @field_validator("items")
    @classmethod
    def validar_total_items(cls, v: List[Item]) -> List[Item]:
        if not v:
            raise ValueError("La orden debe tener al menos un ítem")
        return v

    @property
    def total(self) -> float:
        return sum(i.precio * i.cantidad for i in self.items)

# ---- uso típico ----
payload = {
    "id": 1001,
    "cliente": "María",
    "items": [
        {"sku": "ABCD-1", "nombre": "Teclado", "precio": "49.9", "cantidad": 2},
        {"sku": "EFGH-2", "nombre": "Mouse", "precio": 20, "cantidad": 1},
    ],
}

orden = Orden.model_validate(payload)  # convierte tipos y valida
print(orden.total)  # 119.8
print(orden.model_dump_json(indent=2, exclude_none=True))
```

---

## 20) Testing rápido con `pytest`

```python
import pytest
from pydantic import ValidationError

def test_orden_sin_items_falla():
    with pytest.raises(ValidationError):
        Orden(id=1, cliente="Ana", items=[])

def test_total_ok():
    o = Orden(id=1, cliente="Ana", items=[Item(sku="ABCD-1", nombre="X", precio=10, cantidad=3)])
    assert o.total == 30
```

---

## 21) Integración muy breve con FastAPI (contexto)

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class UsuarioIn(BaseModel):
    nombre: str
    email: str

class UsuarioOut(BaseModel):
    id: int
    nombre: str

@app.post("/usuarios", response_model=UsuarioOut)
def crear_usuario(data: UsuarioIn):
    # ... guardar en DB ...
    return UsuarioOut(id=1, nombre=data.nombre)
```

- FastAPI usa Pydantic para validar `UsuarioIn` y serializar `UsuarioOut`.  
- También genera documentación OpenAPI/Swagger a partir de tus modelos.

---

## 22) Chequeo rápido (Checklist)

- [ ] Instalé `pydantic` (y `pydantic-settings` si usaré `.env`).  
- [ ] Creé mis **modelos** `BaseModel` con tipos y `Field`.  
- [ ] Decidí si quiero **coerción** (flexible) o **modo estricto**.  
- [ ] Agregué **validadores** (`field_validator`/`model_validator`) cuando haga falta.  
- [ ] Controlo la **serialización** (`model_dump`, `exclude`, `by_alias`).  
- [ ] Hice **tests** de validación clave con `ValidationError`.

---

## 23) Recursos para profundizar (recomendado)

- Documentación oficial Pydantic 2.x (Modelos, Validadores, TypeAdapter, Settings).  
- FastAPI docs (sección de Request/Response Models).  
- Patrones de DTO / Clean Architecture / Hexagonal para organizar modelos y mapeos.

---

### Licencia
Este README es de ejemplo educativo. Úsalo y modifícalo libremente en tus proyectos.


"""
Sistema de gestion de productos con ORM SQLAlchemy y Neon PostgreSQL
Incluye sistema de autenticacion con login
"""

import getpass
from typing import Optional

from auth.security import PasswordManager
from crud.CarritoCRUD import CarritoCRUD
from crud.Categoria_productoCRUD import CategoriaCRUD
from crud.FacturaCRUD import FacturaCRUD
from crud.ProductoCRUD import ProductoCRUD
from crud.ProveedorCRUD import ProveedorCRUD
from crud.UsuarioCRUD import UsuarioCRUD
from database.config import SessionLocal, create_tables
from Entidades.Carrito import Carrito
from Entidades.Categoria_prod import Categoria
from Entidades.Detalle_carrito import Detalle_carrito
from Entidades.Factura import Factura
from Entidades.Producto import Producto
from Entidades.Proveedor import Proveedor
from Entidades.Usuario import Usuario


class SistemaGestion:
    """Sistema de gestión por consola (menu)"""

    def __init__(self):
        """Inicializar el sistema"""
        self.db = SessionLocal()
        self.carritoCRUD = CarritoCRUD(self.db)
        self.Categoria_productoCRUD = CategoriaCRUD(self.db)
        self.FacturaCRUD = FacturaCRUD(self.db)
        self.ProductoCRUD = ProductoCRUD(self.db)
        self.ProveedorCRUD = ProveedorCRUD(self.db)
        self.UsuarioCRUD = UsuarioCRUD(self.db)
        self.usuario_actual: Optional[Usuario] = None

    def __enter__(self):
        """Context manager entry"""
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit"""
        self.db.close()

    def login(self) -> bool:
        """Mostrar el Login por consola y autentificar usuario"""
        print("°" * 50)
        print("Bienvenido a Supermercado Murcigato")
        while True:
            print("\n--- Menú de acceso ---")
            print("1. Iniciar sesión")
            print("2. Registrar usuario")
            print("0. Salir")

            opcion = input("\nSeleccione una opción: ").strip()

            if opcion == "1":
                intentos: int = 0
                max_intentos: int = 4

                while intentos < max_intentos:
                    try:
                        print(f"\nIntento {intentos + 1} de {max_intentos}")
                        nombre_usuario = input("Usuario o correo: ").strip()

                        if not nombre_usuario:
                            print("El campo nombre de usuario es obligatorio")
                            intentos += 1
                            continue

                        password = input("Contraseña: ")

                        if not password:
                            print("La contraseña es obligatoria")
                            intentos += 1
                            continue

                        usuario = self.UsuarioCRUD.autenticar_usuario(
                            nombre_usuario, password
                        )

                        if usuario:
                            self.usuario_actual = usuario
                            print(f"\nBienvenido {usuario.primer_nombre}")
                            if self.UsuarioCRUD.es_admin(
                                self.usuario_actual.id_usuario
                            ):
                                print("Tienes privilegios de administrador")
                            return True
                        else:
                            print("Error: información incorrecta o perfil inactivo")
                            intentos += 1

                    except KeyboardInterrupt:
                        print("\nOperación cancelada por el usuario")
                        return False
                    except Exception as e:
                        print(f"\nError durante la ejecución: {e}")
                        intentos += 1

                print("\nSe ha llegado al máximo de intentos, acceso denegado")
                return False

            elif opcion == "2":
                try:
                    print("\n--- Registro de Usuario ---")
                    primer_nombre = input("Primer nombre: ").strip()
                    segundo_nombre = (
                        input("Segundo nombre (opcional): ").strip() or None
                    )
                    primer_apellido = input("Primer apellido: ").strip()
                    segundo_apellido = (
                        input("Segundo apellido (opcional): ").strip() or None
                    )
                    correo = input("Correo electrónico: ").strip()
                    telefono = input("Teléfono (opcional): ").strip() or None
                    direccion = input("Dirección: ").strip()
                    password = input("Contraseña: ")

                    nuevo_usuario = self.UsuarioCRUD.crear_usuario(
                        primer_nombre=primer_nombre,
                        segundo_nombre=segundo_nombre,
                        primer_apellido=primer_apellido,
                        segundo_apellido=segundo_apellido,
                        correo=correo,
                        telefono=telefono,
                        direccion=direccion,
                        contraseña=password,
                    )

                    print(
                        f"\nUsuario {nuevo_usuario.primer_nombre} registrado con éxito!\n"
                    )

                except Exception as e:
                    print(f"\nError al registrar usuario: {e}\n")

            elif opcion == "0":
                print("\n👋 Hasta luego!\n")
                return False

            else:
                print("Opción inválida, intente de nuevo.")

    intentos: int = 0
    max_intentos: int = 4

    def menu_principal(self) -> None:
        """Mostrar menu principal a usuario después de iniciar sesión"""
        print("°" * 50)
        print("Menú principal")
        print("°" * 50)
        print(f"Correo: {self.usuario_actual.correo}")

        if self.UsuarioCRUD.es_admin:
            print("Administrador")
            print("°" * 50)
            print("1. Gestion de Usuarios")
            print("2. Gestion de Categorias")
            print("3. Gestion de Productos")
            print("0. Cerrar Sesion")
            print("°" * 50)

    def menu_perfil(self) -> None:
        """Mostrar el menu de perfil del usuario"""

        while True:
            print("\n" + "-_" * 40)
            print("Perfil")
            print("--" * 40)
            print("1. Ver Informacion Personal")
            print("2. Actualizar Informacion")
            print("3. Cambiar Contrasena")
            print("0. Volver al menu principal")

            op_perfil = input("\nSeleccione una opcion: ").strip()

            if op_perfil == "1":
                self.ver_informacion_personal()
            elif op_perfil == "2":
                self.actualizar_informacion_personal()
            elif op_perfil == "3":
                self.cambiar_password()
            elif op_perfil == "0":
                break
            else:
                print("Opción invalida, intente de nuevo")

    def ver_informacion_personal(self) -> None:
        """Ver informacion personal del usuario"""
        try:
            print(f"\n°^°^°^° Información del usuario °^°^°^°")
            print(f"Nombre: {self.usuario_actual.primer_nombre}")
            print(f"Correo: {self.usuario_actual.correo}")
            print(f"Telefono: {self.usuario_actual.telefono}")
            print(f"Estado: {'Activo' if self.usuario_actual.activo else 'Inactivo'}")
            print(f"Rol: {'Activo' if self.UsuarioCRUD.es_admin else 'Usuario'}")
            print(f"Fecha de creacion: {self.usuario_actual.fecha_registro}")

        except Exception as e:
            print(f"Error durante la ejecución: {e}")

    def actualizar_informacion_personal(self) -> None:
        """Actualizar la informacion personal del usuario"""
        try:
            print(f"\n°^°^°^° Actualizar información personal del usuario °^°^°^°")
            print("Deje en blanco para mantener el valor actual")

            nuevo_correo = input(
                f"Correo actual: ({self.usuario_actual.correo}): "
            ).strip()
            nuevo_telefono = input(
                f"Telefono actual: ({self.usuario_actual.telefono}): "
            ).strip()

            cambios = {}
            if nuevo_correo:
                cambios["correo"] = nuevo_correo
            if nuevo_telefono:
                cambios["telefono"] = nuevo_telefono

            if cambios:
                usuario_actualizado = self.UsuarioCRUD.actualizar_usuario(
                    self.usuario_actual.id_usuario, **cambios
                )
                if usuario_actualizado:
                    self.usuario_actual = usuario_actualizado
                    print(f"Información actualizada exitosamente")
                else:
                    print("Error al actualizar la información")
            else:
                print("Info: No se realizaron cambios")

        except ValueError as e:
            print(f"Error: {e}")
        except Exception as e:
            print(f"Error inesperado: {e}")

    def cambiar_password(self) -> None:
        """Cambiar la contrasena del usuario"""

        try:
            print(f"°^°^°^° Cambiar contraseña °^°^°^°")

            password_actual = input("Contraseña actual: ")
            if not password_actual:
                print("El ingreso de la contraseña actual es obligatorio")
                return

            password_nueva = input("Nueva contraseña: ")
            if not password_nueva:
                print("El ingreso de una nueva contraseña es obligatorio")

            confirmar_password = input("Confirme la nueva contraseña: ")
            if password_nueva != confirmar_password:
                print("Las contraseñas no coinciden")
                return

            if self.UsuarioCRUD.cambiar_contraseña(
                self.usuario_actual.id_usuario, password_actual, password_nueva
            ):
                print("Contraseña modificada existosamente")
            else:
                print("Error al cambiar la contraseña")

        except ValueError as e:
            print(f"Error: {e}")
        except Exception as e:
            print(f"Error inesperado: {e}")

    def menu_usuarios(self) -> None:
        """Mostrar menu de usuarios"""

        while True:
            print("\n" + "-_" * 40)
            print("Menú de usuarios")
            print("-_" * 30)
            print("1. Crear Usuario")
            print("2. Listar Usuarios")
            print("3. Buscar Usuario por Correo")
            print("4. Actualizar Usuario")
            print("5. Crear Usuario Administrador")
            print("0. Volver al menu principal")

            op_usuario = input("\nSeleccione la opción deseada: ").strip()

            if op_usuario == "1":
                self.crear_usuario()
            elif op_usuario == "2":
                self.listar_usuarios()
            elif op_usuario == "3":
                self.buscar_usuario_por_correo()
            elif op_usuario == "4":
                self.actualizar_usuario()
            elif op_usuario == "5":
                self.crear_usuario_admin()
            elif op_usuario == "0":
                break
            else:
                print("Opcion invalida, intente de nuevo")

    def crear_usuario(self) -> None:
        """Crear un nuevo usuario"""

        try:
            print("\n°^°^°^° Crear usuario °^°^°^°")
            primer_nombre = input("Ingrese su primer nombre: ").strip()
            segundo_nombre = input("Ingrese su segundo nombre: ").strip() or None
            primer_apellido = input("Ingrese su primer apellido: ").strip()
            segundo_apellido = input("Ingrese su segundo apellido: ").strip() or None
            correo = input("Ingrese su correo electrónico: ").strip()
            telefono = input("Ingrese su telefono: ").strip() or None
            direccion = input("Ingrese su direccion: ").strip() or None
            password = input("Ingrese una contraseña: ")
            es_admin = input("¿Es administrador? (S/N): ").strip().lower() == "s"

            usuario = self.UsuarioCRUD.crear_usuario(
                primer_nombre,
                primer_apellido,
                correo,
                password,
                direccion,
                segundo_nombre,
                segundo_apellido,
                telefono,
                es_admin,
            )

            print("Usuario creado de manera exitosa: {usuario}")

        except ValueError as e:
            print(f"Error: {e}")
        except Exception as e:
            print(f"Error inesperado: {e}")

    def listar_usuarios(self) -> None:
        """Listar todos los usuarios"""
        try:
            usuarios = self.UsuarioCRUD.obtener_usuarios()
            if not usuarios:
                print("No hay usuarios registrados")
                return

            print(f"\n °^°^°^° Usuarios ({len(usuarios)}) °^°^°^°")
            for i, usuario in enumerate(usuarios, 1):
                admin_text = " (ADMIN)" if self.UsuarioCRUD.es_admin else ""
                activo_text = "Activo" if usuario.activo else "Inactivo"
                print(
                    f"{i}. {usuario.primer_nombre} - {usuario.correo} - {activo_text}{admin_text}"
                )

        except Exception as e:
            print(f"Error: {e}")

    def buscar_usuario_por_correo(self) -> None:
        """Buscar usuario por correo"""
        try:
            correo = input("\nIngrese el correo a buscar: ").strip()
            usuario = self.UsuarioCRUD.obtener_usuario_por_correo(correo)

            if usuario:
                admin_text = " (ADMIN)" if self.UsuarioCRUD.es_admin else ""
                activo_text = "Activo" if usuario.activo else "Inactivo"
                print(f"Usuario encontrado con éxito:")
                print(f"Nombre: {usuario.primer_nombre}")
                print(f"Correo: {usuario.correo}")
                print(f"Telefono: {usuario.telefono or 'No especificado'}")
                print(f"Estado: {activo_text}{admin_text}")
            else:
                print("Usuario no encontrado")

        except Exception as e:
            print(f"Error: {e}")

    def actualizar_usuario(self) -> None:
        """Actualizar un usuario"""
        try:
            correo = input("\nIngrese el correo del usuario a actualizar: ").strip()
            usuario = self.UsuarioCRUD.obtener_usuario_por_correo(correo)

            if not usuario:
                print("Usuario no encontrado")
                return

            print(f"\nActualizando usuario: {usuario.correo}")
            print("Deje en blanco para mantener el valor actual")

            nuevo_correo = input(f"Correo actual ({usuario.correo}): ").strip()
            nuevo_telefono = input(
                f"Telefono actual ({usuario.telefono or 'No especificado'}): "
            ).strip()

            cambios = {}
            if nuevo_correo:
                cambios["correo"] = nuevo_correo
            if nuevo_telefono:
                cambios["telefono"] = nuevo_telefono

            if cambios:
                usuario_actualizado = self.UsuarioCRUD.actualizar_usuario(
                    usuario.id_usuario, **cambios
                )
                print(f"Usuario actualizado: {usuario_actualizado}")
            else:
                print("No se realizaron cambios")

        except ValueError as e:
            print(f"Error: {e}")
        except Exception as e:
            print(f"Error inesperado: {e}")

    def crear_usuario_admin(self) -> None:
        """Crear usuario administrador por defecto"""
        try:
            admin = self.UsuarioCRUD.obtener_usuarios_admin()
            if admin:
                print("Ya existe un usuario administrador por defecto")
                return

            password_admin = PasswordManager.generate_secure_password(12)
            admin = self.UsuarioCRUD.crear_usuario(
                primer_nombre="Administrador del sistema",
                primer_apellido=None,
                correo="admin@sysrem.com",
                password=password_admin,
                direccion=None,
                segundo_nombre=None,
                segundo_apellido=None,
                telefono=None,
                rol="Administrador",
            )
            print(f"Usuario administrador creado: {admin}")
            print(f"Contrasena temporal: {password_admin}")
            print("ADVERTENCIA: Cambie esta contrasena en su primer inicio de sesion")

        except Exception as e:
            print(f"Error: {e}")

    def ejecutar(self) -> None:
        """Ejecutar el sistema principal con autenticacion"""
        try:
            print("Iniciando Sistema de Gestion de Productos Supermercado Murcigato...")
            print("Configurando base de datos...")
            create_tables()
            print("Sistema listo para usar.")

            if not self.login():
                print("°°° Acceso denegado. Hasta luego °°°")
                return

            while True:
                self.menu_principal()
                opcion = input("\nSeleccione una opcion: ").strip()

                if opcion == "1":
                    self.menu_usuarios()
                elif opcion == "2":
                    self.menu_categorias()
                elif opcion == "3":
                    self.menu_productos()
                elif opcion == "0":
                    print("\n¡Hasta luego!")
                    break
                else:
                    print("ERROR: Opcion invalida. Intente nuevamente.")

        except KeyboardInterrupt:
            print("\n\nSistema interrumpido por el usuario")
        except Exception as e:
            print(f"\nError critico: {e}")
        finally:
            self.db.close()

    def menu_categorias(self) -> None:
        print("\n°^°^°^° Menú categorias °^°^°^°")
        while True:
            print("1. Crear categoría")
            print("2. Ver categorías")
            print("3. Actualizar categoría")
            print("0. Volver al menu principal")

            op_cat = input("\nSeleccione una opcion: ").strip()

            if op_cat == "1":
                nombre_categoria = input("Ingrese el nombre de la categoría: ").split()
                descripcion_categoria = input(
                    "Ingrese una descripción para la categoría: "
                ).split()
                id_uscrea = input(
                    "Ingrese el id del usuario que crea, si no lo conoce deje en blanco"
                ).split()
                self.Categoria_productoCRUD.crear_categoria(
                    nombre_categoria, descripcion_categoria, id_uscrea
                )
            elif op_cat == "2":
                self.Categoria_productoCRUD.obtener_categorias()
            elif op_cat == "3":
                id_categoria = input(
                    "Ingrese el id de la categoría a actualizar: "
                ).split()
                id_usActual = input(
                    "Ingrese el id del usuario actual, si no lo conoce deje en blanco: "
                ).split()
                self.Categoria_productoCRUD.actualizar_categoria(id_categoria)
            elif op_cat == "0":
                break
            else:
                print("Opción invalida, intente de nuevo")

    def menu_productos(self) -> None:
        print("\n°^°^°^° Menú productos °^°^°^°")
        while True:
            print("1. Crear producto")
            print("2. Ver productos")
            print("3. Ver producto por id")
            print("4. Ver producto por nombre")
            print("5. Ver productos por categoría")
            print("6. Actualizar stock del producto")
            print("0. Volver al menu principal")

            op_prod = input("\nSeleccione una opcion: ").strip()

            if op_prod == "1":
                nombre_producto = input("Ingrese el nombre del producto: ").split()
                precio_producto = input("Ingrese el precio del producto: ").split()
                stock_producto = input("Ingrese el stock del producto: ").split()
                id_categoria = input(
                    "Ingrese el id de la categoría a la que pertenece el producto: "
                ).split()
                id_usuario = input("Ingrese el id del usuario").split()
                id_usuarioCrea = input(
                    "Ingrese el id del usuario que crea, si no lo conoce deje en blanco: "
                ).split()
                self.ProductoCRUD.crear_producto(
                    nombre_producto,
                    precio_producto,
                    stock_producto,
                    id_categoria,
                    id_usuario,
                    id_usuarioCrea,
                )
            elif op_prod == "2":
                self.ProductoCRUD.obtener_productos()
            elif op_prod == "3":
                id_producto = input("Ingrese el id del producto: ").split()
                self.ProductoCRUD.obtener_producto(id_producto)
            elif op_prod == "4":
                nombre_producto = input("Ingrese el nombre del producto: ").split()
                self.ProductoCRUD.buscar_productos_por_nombre(nombre_producto)
            elif op_prod == "5":
                id_categoria = input("Ingrese el id de la categoría: ").split()
                self.ProductoCRUD.obtener_productos_por_categoria(id_categoria)
            elif op_prod == "6":
                id_producto = input("Ingrese el id del producto: ").split()
                id_usActual = input(
                    "Ingrese el id del usuario actual, si no lo conoce deje el espacio en blanco: "
                ).split()
            elif op_prod == "0":
                break
            else:
                print("Opción invalida, intente de nuevo")


def main():
    """Funcion principal"""
    with SistemaGestion() as sistema:
        sistema.ejecutar()


if __name__ == "__main__":
    main()

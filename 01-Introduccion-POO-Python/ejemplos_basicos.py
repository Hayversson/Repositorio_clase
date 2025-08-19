#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Módulo 1: Ejemplos Básicos de POO en Python
Docente: Alejandro Salgar Marín
ITM 2025-2
"""

print("MÓDULO 1: INTRODUCCIÓN A POO EN PYTHON")
print("=" * 50)

# ============================================================================
# 1. CREACIÓN DE UNA CLASE Y OBJETOS
# ============================================================================
print("\n1. CREACIÓN DE UNA CLASE Y OBJETOS")
print("-" * 40)

class Persona:
    def __init__(self, nombre, edad):
        self.nombre = nombre
        self.edad = edad

    def saludar(self):
        return f"Hola, mi nombre es {self.nombre} y tengo {self.edad} años."

# Crear objetos
persona1 = Persona("Alejandro", 25)
persona2 = Persona("Laura", 30)

print(f"Persona 1: {persona1.saludar()}")
print(f"Persona 2: {persona2.saludar()}")

# ============================================================================
# 2. ENCAPSULACIÓN
# ============================================================================
print("\n2. ENCAPSULACIÓN")
print("-" * 40)

class CuentaBancaria:
    def __init__(self, titular: str, saldo: float):
        self.titular = titular
        self.__saldo = saldo  # Atributo privado

    def depositar(self, cantidad: int):
        self.__saldo += cantidad

    def retirar(self, cantidad: int)-> str:
        if cantidad <= self.__saldo:
            self.__saldo -= cantidad
            return f"Retiro exitoso de ${cantidad}"
        else:
            return "Fondos insuficientes"

    def mostrar_saldo(self):
        return f"Saldo actual: ${self.__saldo}"

# Crear y usar cuenta bancaria
cuenta = CuentaBancaria("Alejandro", 1000)
print(f"Titular: {cuenta.titular}")
print(f"Saldo inicial: {cuenta.mostrar_saldo()}")

print(f"{cuenta.depositar(500)}")
print(f"{cuenta.retirar(200)}")
print(f"{cuenta.mostrar_saldo()}")

# ============================================================================
# 3. HERENCIA
# ============================================================================
print("\n3. HERENCIA")
print("-" * 40)

class Animal:
    def __init__(self, nombre:str):
        self.nombre = nombre

    def hacer_sonido(self) -> str:
        return "Hace un sonido."

class Perro(Animal):
    def hacer_sonido(self):
        return "Guau 🐶"

class Gato(Animal):
    def hacer_sonido(self):
        return "Miau 🐱"

# Crear instancias
perro = Perro("Firulais")
gato = Gato("Mishito")

print(f"{perro.nombre}: {perro.hacer_sonido()}")
print(f"{gato.nombre}: {gato.hacer_sonido()}")

# ============================================================================
# 4. POLIMORFISMO
# ============================================================================
print("\n4. POLIMORFISMO")
print("-" * 40)

animales = [Perro("Boby"), Gato("Luna"), Animal("Criatura")]

print("Demostrando polimorfismo:")
for animal in animales:
    print(f"{animal.nombre}: {animal.hacer_sonido()}")

# ============================================================================
# 5. EJEMPLO COMPLETO - SISTEMA DE VEHÍCULOS
# ============================================================================
print("\n5. SISTEMA COMPLETO DE VEHÍCULOS")
print("-" * 40)

class Vehiculo:
    def __init__(self, marca:str, modelo:str):
        self.marca = marca
        self.modelo = modelo

    def descripcion(self) -> str:
        return f"{self.marca} {self.modelo}"

class Carro(Vehiculo):
    def descripcion(self):
        return f"Carro: {self.marca} {self.modelo}"

class Moto(Vehiculo):
    def descripcion(self):
        return f"Moto: {self.marca} {self.modelo}"

# Crear vehículos
vehiculos = [Carro("Toyota", "Corolla"), Moto("Yamaha", "MT-07")]

print("Descripción de vehículos:")
for v in vehiculos:
    print(f"  {v.descripcion()}")

print("\n¡Ejemplos completados exitosamente!")
print("=" * 50)

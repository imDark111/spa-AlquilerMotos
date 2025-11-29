import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service';
import { Cliente } from '../../Entidades/cliente';
import { Moto } from '../../Entidades/moto';
import { Alquiler } from '../../Entidades/alquiler';
import { Devolucion } from '../../Entidades/devolucion';

@Component({
  selector: 'app-consultas',
  standalone: false,
  templateUrl: './consultas.html',
  styleUrl: './consultas.css'
})
export class Consultas implements OnInit {
  // Consulta 1: Clientes con múltiples alquileres
  clientesMultiplesAlquileres: { cliente: Cliente, cantidadAlquileres: number }[] = [];

  // Consulta 2: Vehículos más alquilados
  vehiculosMasAlquilados: { moto: Moto, cantidadAlquileres: number }[] = [];

  // Consulta 3: Alquileres con descuentos
  alquileresConDescuentos: Alquiler[] = [];

  // Consulta 4: Total recaudado
  totalRecaudado: any = {
    importeNeto: 0,
    depositos: 0,
    multas: 0,
    total: 0
  };

  // Consulta 5: Clientes con multa mayor al depósito
  clientesMultaMayorDeposito: any[] = [];

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.cargarConsultas();
  }

  cargarConsultas(): void {
    // Consulta 1
    this.clientesMultiplesAlquileres = this.localStorageService.getClientesConMultiplesAlquileres();

    // Consulta 2
    this.vehiculosMasAlquilados = this.localStorageService.getVehiculosMasAlquilados();

    // Consulta 3
    this.alquileresConDescuentos = this.localStorageService.getAlquileresConDescuentos();

    // Consulta 4
    this.totalRecaudado = this.localStorageService.getTotalRecaudado();

    // Consulta 5
    this.clientesMultaMayorDeposito = this.localStorageService.getClientesConMultaMayorAlDeposito();
  }

  getNombreCliente(clienteId: string): string {
    const cliente = this.localStorageService.getClienteById(clienteId);
    return cliente ? cliente.nombreCompleto : 'N/A';
  }

  getNombreMoto(motoId: string): string {
    const moto = this.localStorageService.getMotoById(motoId);
    return moto ? `${moto.marca} ${moto.modelo}` : 'N/A';
  }

  actualizar(): void {
    this.cargarConsultas();
  }
}

import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage.service';
import { Devolucion } from '../../Entidades/devolucion';
import { Alquiler } from '../../Entidades/alquiler';
import { Cliente } from '../../Entidades/cliente';
import { Moto } from '../../Entidades/moto';

@Component({
  selector: 'app-devoluciones',
  standalone: false,
  templateUrl: './devoluciones.html',
  styleUrl: './devoluciones.css'
})
export class Devoluciones implements OnInit {
  devoluciones: Devolucion[] = [];
  alquileresActivos: Alquiler[] = [];
  devolucionForm: any = {
    alquilerId: '',
    fechaDevolucionReal: new Date().toISOString().split('T')[0],
    observaciones: ''
  };
  modoFormulario: boolean = false;
  mensajeError: string = '';

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.devoluciones = this.localStorageService.getDevoluciones();
    this.alquileresActivos = this.localStorageService.getAlquileresActivos();
  }

  nuevaDevolucion(): void {
    this.modoFormulario = true;
    this.mensajeError = '';
    this.devolucionForm = {
      alquilerId: '',
      fechaDevolucionReal: new Date().toISOString().split('T')[0],
      observaciones: ''
    };
  }

  procesarDevolucion(): void {
    if (!this.validarFormulario()) {
      return;
    }

    try {
      const fechaDevolucion = new Date(this.devolucionForm.fechaDevolucionReal);
      const devolucion = this.localStorageService.procesarDevolucion(
        this.devolucionForm.alquilerId,
        fechaDevolucion,
        this.devolucionForm.observaciones
      );

      this.cargarDatos();
      this.cancelar();
      
      // Mostrar resumen de la devolución
      if (devolucion.totalAPagar > 0) {
        alert(`Devolución procesada.\nDías de retraso: ${devolucion.diasRetraso}\nMulta: $${devolucion.multaPorRetraso.toFixed(2)}\nTotal a pagar: $${devolucion.totalAPagar.toFixed(2)}`);
      } else {
        alert(`Devolución procesada exitosamente.\nDepósito devuelto: $${devolucion.depositoDevuelto.toFixed(2)}`);
      }
    } catch (error: any) {
      this.mensajeError = error.message;
    }
  }

  validarFormulario(): boolean {
    if (!this.devolucionForm.alquilerId) {
      this.mensajeError = 'Debe seleccionar un alquiler';
      return false;
    }
    if (!this.devolucionForm.fechaDevolucionReal) {
      this.mensajeError = 'Debe ingresar la fecha de devolución';
      return false;
    }
    this.mensajeError = '';
    return true;
  }

  cancelar(): void {
    this.modoFormulario = false;
    this.mensajeError = '';
  }

  eliminarDevolucion(id: string): void {
    if (confirm('¿Está seguro de eliminar esta devolución?')) {
      this.localStorageService.deleteDevolucion(id);
      this.cargarDatos();
    }
  }

  getNombreCliente(alquilerId: string): string {
    const alquiler = this.localStorageService.getAlquilerById(alquilerId);
    if (alquiler) {
      const cliente = this.localStorageService.getClienteById(alquiler.clienteId);
      return cliente ? cliente.nombreCompleto : 'Cliente no encontrado';
    }
    return 'Alquiler no encontrado';
  }

  getNombreMoto(alquilerId: string): string {
    const alquiler = this.localStorageService.getAlquilerById(alquilerId);
    if (alquiler) {
      const moto = this.localStorageService.getMotoById(alquiler.motoId);
      return moto ? `${moto.marca} ${moto.modelo}` : 'Moto no encontrada';
    }
    return 'Alquiler no encontrado';
  }

  getAlquilerInfo(alquilerId: string): string {
    const alquiler = this.localStorageService.getAlquilerById(alquilerId);
    if (alquiler) {
      const cliente = this.localStorageService.getClienteById(alquiler.clienteId);
      const moto = this.localStorageService.getMotoById(alquiler.motoId);
      return `${cliente?.nombreCompleto || 'N/A'} - ${moto?.marca} ${moto?.modelo || 'N/A'}`;
    }
    return 'N/A';
  }

  getClaseRetraso(diasRetraso: number): string {
    if (diasRetraso === 0) return 'sin-retraso';
    if (diasRetraso <= 2) return 'retraso-leve';
    return 'retraso-grave';
  }

  getImporteAlquiler(alquilerId: string): number {
    const alquiler = this.localStorageService.getAlquilerById(alquilerId);
    return alquiler ? alquiler.totalAPagar : 0;
  }

  getTotalConMulta(devolucion: Devolucion): number {
    const importeAlquiler = this.getImporteAlquiler(devolucion.alquilerId);
    return importeAlquiler + devolucion.multaPorRetraso;
  }
}

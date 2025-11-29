import { Component, OnInit } from '@angular/core';
import { Alquiler } from '../../Entidades/alquiler';
import { Moto } from '../../Entidades/moto';
import { Cliente } from '../../Entidades/cliente';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-alquileres',
  standalone: false,
  templateUrl: './alquileres.html',
  styleUrl: './alquileres.css',
})
export class Alquileres implements OnInit {
  alquileres: Alquiler[] = [];
  motosDisponibles: Moto[] = [];
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  
  modoFormulario = false;
  modoEdicion = false;

  alquilerForm: Alquiler = new Alquiler();
  tarifaDiaria: number = 0;

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.alquileres = this.localStorageService.getAlquileres();
    this.motosDisponibles = this.localStorageService.getMotosDisponibles();
    this.clientes = this.localStorageService.getClientes();
    // Filtrar solo clientes con edad mínima (4+ años)
    this.clientesFiltrados = this.clientes.filter(c => c.puedeAlquilar());
  }

  nuevoAlquiler(): void {
    this.alquilerForm = new Alquiler();
    this.alquilerForm.fechaInicio = new Date();
    const fechaTentativa = new Date();
    fechaTentativa.setDate(fechaTentativa.getDate() + 1);
    this.alquilerForm.fechaTentativaDevolucion = fechaTentativa;
    this.tarifaDiaria = 0;
    this.modoEdicion = false;
    this.modoFormulario = true;
  }

  onMotoChange(): void {
    if (this.alquilerForm.motoId) {
      const moto = this.localStorageService.getMotoById(this.alquilerForm.motoId);
      if (moto) {
        this.tarifaDiaria = moto.precioAlquilerDia;
        this.calcularCostos();
      }
    }
  }

  calcularCostos(): void {
    if (this.alquilerForm.clienteId && this.alquilerForm.motoId && 
        this.alquilerForm.fechaInicio && this.alquilerForm.fechaTentativaDevolucion && 
        this.tarifaDiaria > 0) {
      
      const cliente = this.localStorageService.getClienteById(this.alquilerForm.clienteId);
      if (cliente) {
        this.alquilerForm.calcularCostos(this.tarifaDiaria, cliente.clienteFrecuente);
      }
    }
  }

  guardarAlquiler(): void {
    if (this.validarFormulario()) {
      // Validar edad del cliente
      const cliente = this.localStorageService.getClienteById(this.alquilerForm.clienteId);
      if (!cliente || !cliente.puedeAlquilar()) {
        alert('❌ El cliente debe tener al menos 4 años para alquilar.');
        return;
      }

      // Validar si el cliente puede alquilar esta moto específica según su edad y cilindrada
      const moto = this.localStorageService.getMotoById(this.alquilerForm.motoId);
      if (moto) {
        const validacion = cliente.puedeAlquilarMoto(moto.cilindrada);
        if (!validacion.puede) {
          alert(`❌ ${validacion.razon}\n\nCliente: ${cliente.nombreCompleto} (${cliente.edad} años)\nMoto: ${moto.marca} ${moto.modelo} (${moto.cilindrada}cc)`);
          return;
        }
      }

      // Normalizar las fechas para evitar problemas de zona horaria
      if (typeof this.alquilerForm.fechaInicio === 'string') {
        const [year, month, day] = (this.alquilerForm.fechaInicio as any).split('-');
        this.alquilerForm.fechaInicio = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }
      if (typeof this.alquilerForm.fechaTentativaDevolucion === 'string') {
        const [year, month, day] = (this.alquilerForm.fechaTentativaDevolucion as any).split('-');
        this.alquilerForm.fechaTentativaDevolucion = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }

      this.calcularCostos();
      this.localStorageService.saveAlquiler(this.alquilerForm);
      alert('✅ Alquiler guardado exitosamente');
      this.cargarDatos();
      this.cancelarFormulario();
    }
  }

  finalizarAlquiler(id: string): void {
    if (confirm('¿Finalizar este alquiler?')) {
      this.localStorageService.finalizarAlquiler(id);
      this.cargarDatos();
    }
  }

  eliminarAlquiler(id: string): void {
    if (confirm('¿Está seguro de eliminar este alquiler?')) {
      this.localStorageService.deleteAlquiler(id);
      this.cargarDatos();
    }
  }

  cancelarFormulario(): void {
    this.modoFormulario = false;
    this.alquilerForm = new Alquiler();
    this.modoEdicion = false;
  }

  validarFormulario(): boolean {
    return !!(
      this.alquilerForm.clienteId &&
      this.alquilerForm.motoId &&
      this.alquilerForm.fechaInicio &&
      this.alquilerForm.fechaTentativaDevolucion &&
      this.tarifaDiaria > 0
    );
  }

  getClienteClass(clienteId: string): string {
    const cliente = this.localStorageService.getClienteById(clienteId);
    return cliente?.clienteFrecuente ? 'cliente-frecuente' : '';
  }

  puedeAlquilar(clienteId: string): boolean {
    const cliente = this.localStorageService.getClienteById(clienteId);
    return cliente ? cliente.puedeAlquilar() : false;
  }

  getNombreCliente(clienteId: string): string {
    const cliente = this.localStorageService.getClienteById(clienteId);
    return cliente ? cliente.nombreCompleto : 'N/A';
  }

  getNombreMoto(motoId: string): string {
    const moto = this.localStorageService.getMotoById(motoId);
    return moto ? `${moto.marca} ${moto.modelo}` : 'N/A';
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'activo': return 'badge-activo';
      case 'finalizado': return 'badge-finalizado';
      case 'cancelado': return 'badge-cancelado';
      default: return '';
    }
  }
}

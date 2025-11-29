import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../Entidades/cliente';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-clientes',
  standalone: false,
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes implements OnInit {
  clientes: Cliente[] = [];
  clienteSeleccionado: Cliente | null = null;
  modoEdicion = false;
  modoFormulario = false;

  clienteForm: Cliente = new Cliente();

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.clientes = this.localStorageService.getClientes();
  }

  nuevoCliente(): void {
    this.clienteForm = new Cliente();
    this.modoEdicion = false;
    this.modoFormulario = true;
  }

  editarCliente(cliente: Cliente): void {
    this.clienteForm = Object.assign(new Cliente(), cliente);
    this.modoEdicion = true;
    this.modoFormulario = true;
  }

  guardarCliente(): void {
    if (this.validarFormulario()) {
      this.localStorageService.saveCliente(this.clienteForm);
      this.cargarClientes();
      this.cancelarFormulario();
    }
  }

  eliminarCliente(id: string): void {
    if (confirm('¿Está seguro de eliminar este cliente?')) {
      this.localStorageService.deleteCliente(id);
      this.cargarClientes();
    }
  }

  cancelarFormulario(): void {
    this.modoFormulario = false;
    this.clienteForm = new Cliente();
    this.modoEdicion = false;
  }

  validarFormulario(): boolean {
    return !!(
      this.clienteForm.nombres &&
      this.clienteForm.apellidos &&
      this.clienteForm.cedula &&
      this.clienteForm.fechaNacimiento &&
      this.clienteForm.email &&
      this.clienteForm.telefono &&
      this.clienteForm.licenciaConducir
    );
  }
}
